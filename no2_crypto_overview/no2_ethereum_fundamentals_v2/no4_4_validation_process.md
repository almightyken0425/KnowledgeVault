# 驗證與出塊流程 Validation and Block Production Process

## 驗證者角色 Validator Role

- **質押要求:** 32 ETH 作為保證金。
- **被選中機率:** 根據質押數量隨機選擇。

---

## 區塊提議流程 Block Proposal Process

```python
# 1. 驗證者被選中
validator = randomly_select(validators, slot)

# 2. 從 Mempool 選擇交易
transactions = select_transactions(mempool, gas_limit)

# 3. 執行交易 (EL)
new_state = execute_transactions(transactions, current_state)

# 4. 構建區塊 (CL)
block = {
    "header": {
        "parent_hash": parent_block_hash,
        "state_root": new_state_root,
        ...
    },
    "transactions": transactions
}

# 5. 簽名並廣播
signed_block = sign(block, validator_key)
broadcast(signed_block)
```

---

## 區塊驗證流程 Block Validation Process

### LMD-GHOST 分叉選擇

- **定義:** Latest Message Driven Greedy Heaviest Observed SubTree
- **目的:** 選擇正確的鏈頭。

### Casper FFG 最終性確認

- **定義:** Friendly Finality Gadget
- **最終性條件:** 經過 2 個 Epoch 約 12.8 分鐘後，區塊被視為不可逆。

---

## 獎勵與罰沒 Rewards and Slashing

### 誠實驗證獎勵

- **區塊提議獎勵:** ~0.02 ETH
- **Attestation 獎勵:** ~0.00014 ETH per slot

### Slashing 嚴重違規

- **雙重簽名:** 罰沒 1 ETH 起
- **Surround Vote:** 違反 Casper 投票規則

---

## 與比特幣挖礦的對比

| 特性         | 比特幣 PoW     | 以太坊 PoS         |
| ------------ | -------------- | ------------------ |
| 資源消耗     | 大量電力       | 僅需 32 ETH        |
| 出塊時間     | ~10 分鐘       | 12 秒              |
| 最終性       | 6 確認 ~1 小時 | 2 Epoch ~12.8 分鐘 |
| 51% 攻擊成本 | 購買算力       | 質押 51% ETH       |
