"""
Monefy Database Export Script
==============================
從 Monefy 的 SQLite 資料庫匯出資料到 CSV 格式

輸出檔案:
- transactions.csv: 交易記錄
- transfers.csv: 轉帳記錄

CSV 格式設計:
- 時間: YYYY-MM-DD HH:MM:SS
- 金額: 支出為負值，收入為正值
- 跨幣別轉帳: 透過 CurrencyRate 計算雙向金額
"""

import sqlite3
import csv
from datetime import datetime, timedelta
from pathlib import Path
import sys
import calendar

# 設定路徑
SCRIPT_DIR = Path(__file__).parent
DEFAULT_DB_PATH = SCRIPT_DIR / "../Original_DB_Data/monefy_database-2026-01-20_16-57-31.db"


def ticks_to_datetime(ticks: int) -> datetime | None:
    """
    轉換 .NET Ticks 到 Python datetime
    
    # .NET Ticks: 100ns intervals since 0001-01-01 00:00:00
    # Python datetime min is 0001-01-01
    # 這裡直接轉換為 Naive DateTime，因為 Monefy 資料庫中的 Ticks 通常已經是使用者當地的時間
    # 如果使用 fromtimestamp，Python 會將其視為 UTC 秒數並加上系統時區偏移 (如 +8)，導致時間重複加總
    """
    if ticks is None:
        return None
    try:
        base = datetime(1, 1, 1)
        delta = timedelta(microseconds=ticks/10)
        return base + delta
    except (OSError, OverflowError, ValueError):
        return None


def cents_to_decimal(cents: int, currency_code: str = None, is_schedule: bool = False) -> float:
    """
    轉換 cents 到 decimal 格式
    
    規則發現:
    1. 真實交易 (Transaction/Transfer): TWD, USD 使用 3 位小數 (/1000)
    2. 循環交易 (Schedule): 似乎都使用 2 位小數 (/100) (驗證 PEN, TWD)
    3. 其他幣別 (PEN): Transaction/Transfer 似乎也是 2 位 (待驗證，暫設 /100)
    """
    if cents is None:
        return 0.0

    # 優先處理已知使用 3 位小數的幣別 (TWD, USD)
    # 發現 Schedule 也遵循此規則 (例: TWD 1457000 -> 1457.0)
    if currency_code in ('TWD', 'USD'):
        return cents / 1000
        
    # Schedule 的其他幣別預設行為
    # 先前觀察 18500 -> 185.0 (可能是非 TWD/USD 幣別?)
    if is_schedule:
        return cents / 100
        
    # 其他預設
    return cents / 100


def get_exchange_rate(cursor, from_currency_id: int, to_currency_id: int, 
                      transfer_ticks: int) -> tuple[float, bool, str]:
    """
    查詢最接近轉帳日期的匯率
    
    回傳: (匯率值, 是否為反向匯率, 匯率類型)
    匯率類型: 'Exact' (完全符合) 或 'Nearest' (最近)
    """
    if from_currency_id == to_currency_id:
        return 1.0, False, 'SameCurrency'
    
    # 1. 嘗試正向完全匹配
    cursor.execute('''
        SELECT RateCents 
        FROM "CurrencyRate" 
        WHERE CurrencyFromId = ? AND CurrencyToId = ?
        AND RateDate = ?
        AND DeletedOn IS NULL
        LIMIT 1
    ''', (from_currency_id, to_currency_id, transfer_ticks))
    
    result = cursor.fetchone()
    if result:
        rate = result[0] / 1000000
        return rate, False, 'Exact'

    # 2. 嘗試反向完全匹配
    cursor.execute('''
        SELECT RateCents 
        FROM "CurrencyRate" 
        WHERE CurrencyFromId = ? AND CurrencyToId = ?
        AND RateDate = ?
        AND DeletedOn IS NULL
        LIMIT 1
    ''', (to_currency_id, from_currency_id, transfer_ticks))
    
    result = cursor.fetchone()
    if result:
        rate = result[0] / 1000000
        return 1 / rate if rate != 0 else 0, True, 'Exact'

    # 3. 嘗試正向最近查詢
    cursor.execute('''
        SELECT RateCents, RateDate 
        FROM "CurrencyRate" 
        WHERE CurrencyFromId = ? AND CurrencyToId = ?
        AND DeletedOn IS NULL
        ORDER BY ABS(RateDate - ?)
        LIMIT 1
    ''', (from_currency_id, to_currency_id, transfer_ticks))
    
    result = cursor.fetchone()
    if result:
        rate = result[0] / 1000000
        return rate, False, 'Nearest'
    
    # 4. 嘗試反向最近查詢
    cursor.execute('''
        SELECT RateCents, RateDate 
        FROM "CurrencyRate" 
        WHERE CurrencyFromId = ? AND CurrencyToId = ?
        AND DeletedOn IS NULL
        ORDER BY ABS(RateDate - ?)
        LIMIT 1
    ''', (to_currency_id, from_currency_id, transfer_ticks))
    
    result = cursor.fetchone()
    if result:
        rate = result[0] / 1000000
        return 1 / rate if rate != 0 else 0, True, 'Nearest'
    
    # 找不到匯率
    return 0.0, False, 'NotFound'


def add_months(sourcedate, months):
    """計算月份加法，自動處理月底日期 (如 1/31 + 1月 = 2/28)"""
    month = sourcedate.month - 1 + months
    year = sourcedate.year + month // 12
    month = month % 12 + 1
    day = min(sourcedate.day, calendar.monthrange(year, month)[1])
    return datetime(year, month, day, sourcedate.hour, sourcedate.minute, sourcedate.second)


def generate_scheduled_transactions(cursor) -> list:
    """
    根據 Schedule 設定產生循環交易記錄
    
    回傳: [(datetime_str, category_name, account_name, amount_decimal, currency_code, note), ...]
    """
    # 查詢所有有效的 Schedule 及其模板 Transaction
    query = '''
        SELECT 
            s.StartOn,
            s.EndOn,
            s.ScheduleType,
            c.Name as CategoryName,
            c.CategoryType,
            a.Name as AccountName,
            t.AmountCents,
            cur.AlphabeticCode as CurrencyCode,
            t.Note,
            s.Id as ScheduleId
        FROM "Schedule" s
        JOIN "Transaction" t ON s.EntityId = t.Id
        JOIN "Category" c ON t.CategoryId = c.Id
        JOIN "Account" a ON t.AccountId = a.Id
        JOIN "Currency" cur ON a.CurrencyId = cur.Id
        WHERE s.DeletedOn IS NULL
          AND c.DeletedOn IS NULL
          AND a.DeletedOn IS NULL
    '''
    
    cursor.execute(query)
    schedules = cursor.fetchall()

    scheduled_txs = []
    
    for schedule in schedules:
        start_ticks, end_ticks, schedule_type, cat_name, cat_type, acc_name, amount_cents, currency, note, schedule_id = schedule
        
        # 轉換時間
        start_dt = ticks_to_datetime(start_ticks)
        # 如果沒有 EndOn，則產生直到今天的記錄 (或是未來某個時間點，這裡設為今天)
        # 用戶提到 "到 2025年12月"，所以我們應該允許產生未來的資料
        # 但通常記帳軟體顯示未來交易只會顯示到即將到期的
        # 不過這裡是匯出資料，如果是用作還原，應該盡量還原 Schedule 的意圖
        # 這裡設定一個合理的上限，例如 2030 年，或者如果沒有 EndOn 就產生到現在 + 1年?
        # 根據用戶描述 "2022年4月到2025年12月"，這表示 EndTicks 應該是有值的
        end_dt = ticks_to_datetime(end_ticks) 
        if not end_dt:
             # 如果沒有結束日期，預設產生到今天，避免無限迴圈
             end_dt = datetime.now()

        if not start_dt:
            continue
        
        # ScheduleType=3 表示月度循環
        if schedule_type == 3:
            current_dt = start_dt
            while current_dt <= end_dt:
                datetime_str = current_dt.strftime('%Y-%m-%d %H:%M:%S')
                
                # 轉換金額 (Schedule 使用標準位數)
                amount = cents_to_decimal(amount_cents, currency, is_schedule=True)
                if cat_type == 1:
                    amount = -amount
                
                # 備註加上標記 (可選)
                final_note = note or ''
                # final_note += f" [Schedule: {schedule_id[:8]}]"
                
                scheduled_txs.append({
                    'datetime_obj': current_dt,
                    'datetime_str': datetime_str,
                    'category': cat_name or '',
                    'account': acc_name or '',
                    'amount': amount,
                    'currency': currency or '',
                    'note': final_note,
                    'is_virtual': True # 標記為虛擬交易
                })
                
                # 下個月
                current_dt = add_months(current_dt, 1)
    
    return scheduled_txs


def export_transactions(cursor, output_path: Path) -> int:
    """
    匯出交易記錄到 transactions.csv
    
    欄位: transaction_datetime, category, account, amount, currency, note
    """
    # 1. 獲取真實交易記錄
    query = '''
        SELECT 
            t.CreatedOn,
            c.Name as CategoryName,
            c.CategoryType,
            a.Name as AccountName,
            t.AmountCents,
            cur.AlphabeticCode as CurrencyCode,
            t.Note
        FROM "Transaction" t
        JOIN "Category" c ON t.CategoryId = c.Id
        JOIN "Account" a ON t.AccountId = a.Id
        JOIN "Currency" cur ON a.CurrencyId = cur.Id
        WHERE t.DeletedOn IS NULL
          AND a.DeletedOn IS NULL
        ORDER BY t.CreatedOn
    '''
    
    cursor.execute(query)
    rows = cursor.fetchall()
    
    # [Fix] Pre-fetch Category Deleted Status
    # We need to know if a category is deleted to filter its transactions
    cursor.execute("PRAGMA table_info('Category')")
    cat_cols = [r[1] for r in cursor.fetchall()]
    cat_id_col = 'Id' if 'Id' in cat_cols else '_id'
    
    cursor.execute(f"SELECT {cat_id_col}, DeletedOn FROM 'Category'")
    # Map CategoryId -> IsDeleted (True/False)
    categories_deleted_status = {str(r[0]): (r[1] is not None) for r in cursor.fetchall()}
    print(f"Loaded {len(categories_deleted_status)} categories (Deleted: {sum(categories_deleted_status.values())})")
    
    all_transactions = []
    
    # 處理真實交易
    for row in rows:
        created_on, category_name, category_type, account_name, amount_cents, currency_code, note = row
        
        dt = ticks_to_datetime(created_on)
        if dt is None:
            continue
            
        # [Fix] Filter out transactions belonging to deleted categories
        # Monefy App hides transactions if their category is deleted, even if the transaction itself is active.
        if categories_deleted_status.get(str(row[col_map['categoryId']])):
            continue

        amount = cents_to_decimal(amount_cents, currency_code, is_schedule=False)
        if category_type == 1:
            amount = -amount
            
        all_transactions.append({
            'datetime_obj': dt,
            'datetime_str': dt.strftime('%Y-%m-%d %H:%M:%S'),
            'category': category_name or '',
            'account': account_name or '',
            'amount': amount,
            'currency': currency_code or '',
            'note': note or '',
            'is_virtual': False
        })
        
    # 2. 獲取循環交易記錄
    virtual_txs = generate_scheduled_transactions(cursor)
    
    # 3. 合併並去重 (簡單去重: 如果同一天、同金額、同備註已有真實交易，則不加入虛擬交易)
    # 這裡採取寬鬆策略：如果 Schedule 產生的交易在 DB 中已經有"實體化"的記錄 (通常有 ScheduleId)，則不應該重複添加
    # 但先前分析發現只有 9 筆 Transaction 有 ScheduleId。
    # 為了避免重複，我們可以嘗試檢查：如果同一天 (YYYY-MM-DD)、同金額、同 Account 已經存在，就跳過虛擬的
    
    # 建立真實交易的指紋集合 set((date_str, account, amount_str))
    existing_fingerprints = set()
    for tx in all_transactions:
        # 使用 date 而非 datetime 比較，因為手動確認的時間可能會有秒差? 
        # Monefy 自動產生的 Schedule 交易時間通常是 08:00:00 (從數據看) 或者與 StartOn 相同的時間
        # 這裡用 YYYY-MM-DD + Account + Amount 作為指紋
        date_str = tx['datetime_obj'].strftime('%Y-%m-%d')
        amount_str = f"{tx['amount']:.2f}"
        fingerprint = (date_str, tx['account'], amount_str)
        existing_fingerprints.add(fingerprint)
        
    # 加入虛擬交易 (如果不存在)
    added_virtual_count = 0
    for v_tx in virtual_txs:
        date_str = v_tx['datetime_obj'].strftime('%Y-%m-%d')
        amount_str = f"{v_tx['amount']:.2f}"
        fingerprint = (date_str, v_tx['account'], amount_str)
        
        if fingerprint not in existing_fingerprints:
            all_transactions.append(v_tx)
            added_virtual_count += 1
            # 加回指紋防止 Schedule 自身重複 (雖然 generate 邏輯應該不會)
            existing_fingerprints.add(fingerprint)
            
    # 4. 重新排序
    all_transactions.sort(key=lambda x: x['datetime_obj'])
    
    # 5. 寫入 CSV
    with open(output_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow([
            'transaction_datetime', 'category', 'account', 
            'amount', 'currency', 'note'
        ])
        
        for tx in all_transactions:
            writer.writerow([
                tx['datetime_str'],
                tx['category'],
                tx['account'],
                f"{tx['amount']:.2f}",
                tx['currency'],
                tx['note']
            ])
            
    print(f"   (包含 {added_virtual_count} 筆由 Schedule 產生的虛擬交易)")
    return len(all_transactions)


def export_transfers(cursor, output_path: Path) -> int:
    """
    匯出轉帳記錄到 transfers.csv
    
    欄位: transfer_datetime, from_account, from_currency, from_amount,
          to_account, to_currency, to_amount, exchange_rate, note
    """
    query = '''
        SELECT 
            tr.CreatedOn,
            af.Name as FromAccountName,
            cf.AlphabeticCode as FromCurrencyCode,
            cf.Id as FromCurrencyId,
            at.Name as ToAccountName,
            ct.AlphabeticCode as ToCurrencyCode,
            ct.Id as ToCurrencyId,
            tr.AmountCents,
            tr.Note
        FROM "Transfer" tr
        JOIN "Account" af ON tr.AccountFromId = af.Id
        JOIN "Account" at ON tr.AccountToId = at.Id
        JOIN "Currency" cf ON af.CurrencyId = cf.Id
        JOIN "Currency" ct ON at.CurrencyId = ct.Id
        WHERE tr.DeletedOn IS NULL
          AND af.DeletedOn IS NULL
          AND at.DeletedOn IS NULL
        ORDER BY tr.CreatedOn
    '''
    
    cursor.execute(query)
    rows = cursor.fetchall()
    
    count = 0
    with open(output_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow([
            'transfer_datetime', 'from_account', 'from_currency', 'from_amount',
            'to_account', 'to_currency', 'to_amount', 'exchange_rate', 'rate_type', 'note'
        ])
        
        for row in rows:
            (created_on, from_account, from_currency_code, from_currency_id,
             to_account, to_currency_code, to_currency_id, amount_cents, note) = row
            
            # 轉換時間
            dt = ticks_to_datetime(created_on)
            if dt is None:
                continue
            datetime_str = dt.strftime('%Y-%m-%d %H:%M:%S')
            
            # 轉換金額 (Transfer 也視為真實交易)
            from_amount = cents_to_decimal(amount_cents, from_currency_code, is_schedule=False)
            
            # 計算轉入金額 (Monefy Transfer 表只有一個 AmountCents，假設它是轉出金額)
            rate_type = 'SameCurrency'
            if from_currency_id == to_currency_id:
                exchange_rate = 1.0
                to_amount = from_amount
            else:
                exchange_rate, _, rate_type = get_exchange_rate(
                    cursor, from_currency_id, to_currency_id, created_on
                )
                to_amount = from_amount * exchange_rate if exchange_rate else 0.0
            
            writer.writerow([
                datetime_str,
                from_account or '',
                from_currency_code or '',
                f'{from_amount:.2f}',
                to_account or '',
                to_currency_code or '',
                f'{to_amount:.2f}',
                f'{exchange_rate:.5f}',
                rate_type,
                note or ''
            ])
            count += 1
    
    return count


def main(db_path: Path = None):
    """主程式進入點"""
    if db_path is None:
        db_path = DEFAULT_DB_PATH
    
    if not db_path.exists():
        print(f"錯誤: 找不到資料庫檔案 {db_path}")
        sys.exit(1)
    
    print("=" * 60)
    print("Monefy Database Export Script")
    print("=" * 60)
    print(f"\n資料庫: {db_path}")
    
    # 連接資料庫
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # 匯出 transactions
        transactions_path = SCRIPT_DIR / "../Export_Data/transactions.csv"
        print(f"\n匯出交易記錄中...")
        tx_count = export_transactions(cursor, transactions_path)
        print(f"✓ 已匯出 {tx_count} 筆交易到 {transactions_path.name}")
        
        # 匯出 transfers
        transfers_path = SCRIPT_DIR / "../Export_Data/transfers.csv"
        print(f"\n匯出轉帳記錄中...")
        tr_count = export_transfers(cursor, transfers_path)
        print(f"✓ 已匯出 {tr_count} 筆轉帳到 {transfers_path.name}")
        
        print("\n" + "=" * 60)
        print("匯出完成!")
        print("=" * 60)
        
    finally:
        conn.close()


if __name__ == "__main__":
    # 支援命令列參數指定資料庫路徑
    if len(sys.argv) > 1:
        db_path = Path(sys.argv[1])
    else:
        db_path = None
    
    main(db_path)
