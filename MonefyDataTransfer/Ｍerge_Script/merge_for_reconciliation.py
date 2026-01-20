"""
合併 transactions.csv 與 transfers.csv 為 reconciliation.csv
用於 Google Sheet 資料透視表對帳

輸出格式：
- datetime: 交易時間
- account: 帳戶名稱
- category: 類別名稱，轉帳會顯示為「轉出」或「轉入」
- amount: 金額，正數為收入，負數為支出
- currency: 幣別
- note: 備註
"""

import csv
from datetime import datetime

from pathlib import Path

# 檔案路徑
SCRIPT_DIR = Path(__file__).parent
TRANSACTIONS_PATH = SCRIPT_DIR / "../Export_Data/transactions.csv"
TRANSFERS_PATH = SCRIPT_DIR / "../Export_Data/transfers.csv"
OUTPUT_PATH = SCRIPT_DIR / "../Export_Data/reconciliation.csv"

def main():
    all_records = []
    
    # 讀取 transactions.csv
    print("讀取 transactions.csv...")
    with open(TRANSACTIONS_PATH, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            all_records.append({
                'datetime': row['transaction_datetime'],
                'account': row['account'],
                'category': row['category'],
                'amount': float(row['amount']),
                'currency': row['currency'],
                'note': row['note']
            })
    print(f"  讀取 {len(all_records)} 筆交易")
    
    # 讀取 transfers.csv 並拆成兩筆紀錄
    print("讀取 transfers.csv...")
    transfer_count = 0
    with open(TRANSFERS_PATH, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            transfer_count += 1
            
            # 轉出紀錄：from_account 減少金額
            all_records.append({
                'datetime': row['transfer_datetime'],
                'account': row['from_account'],
                'category': f"轉出至 {row['to_account']}",
                'amount': -abs(float(row['from_amount'])),
                'currency': row['from_currency'],
                'note': row['note']
            })
            
            # 轉入紀錄：to_account 增加金額
            all_records.append({
                'datetime': row['transfer_datetime'],
                'account': row['to_account'],
                'category': f"轉入自 {row['from_account']}",
                'amount': abs(float(row['to_amount'])),
                'currency': row['to_currency'],
                'note': row['note']
            })
    print(f"  讀取 {transfer_count} 筆轉帳，展開為 {transfer_count * 2} 筆紀錄")
    
    # 按時間排序
    print("排序所有紀錄...")
    all_records.sort(key=lambda x: x['datetime'])
    
    # 輸出合併檔案
    print(f"輸出至 {OUTPUT_PATH}...")
    with open(OUTPUT_PATH, 'w', encoding='utf-8-sig', newline='') as f:
        fieldnames = ['datetime', 'account', 'category', 'amount', 'currency', 'note']
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(all_records)
    
    print(f"\n完成！共 {len(all_records)} 筆紀錄")
    
    # 統計各帳戶摘要
    print("\n=== 帳戶摘要 ===")
    account_summary = {}
    for record in all_records:
        acc = record['account']
        if acc not in account_summary:
            account_summary[acc] = {'count': 0, 'total': 0.0}
        account_summary[acc]['count'] += 1
        account_summary[acc]['total'] += record['amount']
    
    for acc in sorted(account_summary.keys()):
        info = account_summary[acc]
        print(f"  {acc}: {info['count']} 筆, 淨額 {info['total']:,.2f}")

if __name__ == '__main__':
    main()
