import sqlite3
from pathlib import Path
from datetime import datetime, timedelta

DB_PATH = Path("./Original_DB_Data/monefy_database-2026-01-20_16-57-31.db")

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

def ticks_to_datetime(ticks):
    if not ticks: return None
    try:
        return datetime(1, 1, 1) + timedelta(microseconds=ticks/10)
    except:
        return None

def cents_to_decimal(cents):
    return (cents or 0) / 1000.0

print("--- Analyzing '保險' Schedules ---")

query = '''
    SELECT 
        s.Id,
        c.Name as Category,
        s.StartOn,
        s.EndOn,
        s.DeletedOn,
        t.AmountCents,
        s.ScheduleType,
        t.Note
    FROM "Schedule" s
    JOIN "Transaction" t ON s.EntityId = t.Id
    JOIN "Category" c ON t.CategoryId = c.Id
    WHERE c.Name LIKE '%保險%' OR c.Name LIKE '%Insurance%'
'''

cursor.execute(query)
rows = cursor.fetchall()

print(f"{'Category':<10} | {'Start':<10} | {'End':<10} | {'Deleted':<10} | {'Amount':<10} | {'Note'}")
print("-" * 100)

for row in rows:
    sid, cat, start, end, deleted, amt, stype, note = row
    
    s_dt = ticks_to_datetime(start).strftime('%Y-%m-%d') if ticks_to_datetime(start) else "N/A"
    e_dt = ticks_to_datetime(end).strftime('%Y-%m-%d') if ticks_to_datetime(end) else "None"
    d_dt = ticks_to_datetime(deleted).strftime('%Y-%m-%d') if ticks_to_datetime(deleted) else "Active"
    
    amount = cents_to_decimal(amt)
    
    print(f"{cat:<10} | {s_dt:<10} | {e_dt:<10} | {d_dt:<10} | {amount:<10.2f} | {note}")

conn.close()
