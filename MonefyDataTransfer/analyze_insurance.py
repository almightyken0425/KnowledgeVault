import sqlite3
from pathlib import Path

# Path to DB
# Original_DB_Data/monefy_database-2026-01-20_16-57-31.db
DB_PATH = Path("./Original_DB_Data/monefy_database-2026-01-20_16-57-31.db")

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

def cents_to_decimal(cents):
    return (cents or 0) / 1000.0

# 1. Find all categories matching '保險' or 'Insurance'
print("--- Searching for Insurance Categories ---")
# Get correct ID column handling
cursor.execute("PRAGMA table_info('Category')")
cols = [r[1] for r in cursor.fetchall()]
id_col = 'Id' if 'Id' in cols else '_id'
title_col = 'Title' if 'Title' in cols else ('Name' if 'Name' in cols else 'title')

print(f"Using ID: {id_col}, Title: {title_col}")

query = f'''
    SELECT 
        {id_col}, {title_col}, DeletedOn, CategoryType 
    FROM "Category"
'''
cursor.execute(query)
rows = cursor.fetchall()
insurance_cats = []
for r in rows:
    cat_id, title, deleted, ctype = r
    # Check match safely
    title_str = str(title)
    if "保險" in title_str or "Insurance" in title_str:
        insurance_cats.append((cat_id, title, deleted, ctype))

print(f"Found {len(insurance_cats)} Matching Categories:")
for cat in insurance_cats:
    cat_id, title, deleted, ctype = cat
    del_status = "Deleted" if deleted else "Active"
    print(f" - [{del_status}] {title} (ID: {cat_id})")

# 2. Sum transactions for EACH of these categories
print("\n--- Transaction Sums per Category ID ---")

cursor.execute("PRAGMA table_info('Transaction')")
t_cols = [r[1] for r in cursor.fetchall()]
t_cat_col = 'CategoryId' if 'CategoryId' in t_cols else 'category_id'

for cat in insurance_cats:
    cat_id, title, deleted, ctype = cat
    
    # Sum Transaction
    cursor.execute(f'''
        SELECT COUNT(*), SUM(AmountCents) 
        FROM "Transaction" 
        WHERE {t_cat_col} = ? AND DeletedOn IS NULL
    ''', (cat_id,))
    res = cursor.fetchone()
    count = res[0]
    total = cents_to_decimal(res[1])
    if ctype == 1: total = -total
    
    print(f"Category: {title} ({cat_id})")
    print(f"  > Transactions: {count}")
    print(f"  > Total Amount: {total:,.2f}")
    
conn.close()
