# 智能合約部署 Contract Deployment

## 合約部署本質 Deployment Essence

- **定義 Definition:** 將編譯後的 Bytecode 上傳到區塊鏈，創建新的合約賬戶。
- **特殊交易:** `to` 欄位為 `null`，`data` 包含 Bytecode。

---

## 部署流程 Deployment Process

### Solidity 編譯

```solidity
// SimpleStorage.sol
contract SimpleStorage {
    uint256 public value;
    
    constructor(uint256 _value) {
        value = _value;
    }
    
    function setValue(uint256 _value) public {
        value = _value;
    }
}
```

編譯為 Bytecode:
```
0x608060405234801561001057600080fd5b506040516101...
```

### 構造函數參數編碼

```python
# ABI 編碼構造函數參數
constructor_args = abi.encode(['uint256'], [100])

# 完整 Bytecode = 合約 Bytecode + 構造函數參數
full_bytecode = bytecode + constructor_args
```

### 發送部署交易

```python
tx = {
    "from": deployer_address,
    "to": null,  # 部署交易
    "value": 0,
    "data": full_bytecode,
    "gas_limit": 500000,
    "max_fee_per_gas": 50000000000,
    "max_priority_fee_per_gas": 2000000000
}

signed_tx = sign_transaction(tx, private_key)
tx_hash = eth_sendRawTransaction(signed_tx)
```

---

## 合約地址計算 Contract Address Calculation

### CREATE 方法

```python
# 地址 = keccak256(rlp([sender, nonce]))[-20:]
contract_address = keccak256(rlp.encode([
    deployer_address,
    deployer_nonce
]))[-20:]
```

### CREATE2 方法 EIP-1014

```python
# 地址 = keccak256(0xFF + sender + salt + keccak256(bytecode))[-20:]
contract_address = keccak256(
    b'\xFF' +
    deployer_address +
    salt +
    keccak256(bytecode)
)[-20:]
```

**優勢:** 可在部署前確定地址，用於 Layer 2 或跨鏈場景。

---

## 與比特幣的對比

比特幣不支援智能合約部署，這是以太坊的獨有特性。
