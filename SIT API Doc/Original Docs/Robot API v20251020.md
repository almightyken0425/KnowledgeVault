# API Endpoints

## VIP API

### Get Player VIP Information

**Function**: Retrieve VIP level information for a specific player

**HTTP Method**: `GET`

**URI**: `/api/vip/info`

#### **Request Parameters**

Parameters are sent in the **Query String**.

|Parameter|Type|Required|Length|Description|Example|
|---|---|---|---|---|---|
|`playerId`|Long|Yes|-|Player ID|`9197`|

#### **Request Example**

```http
GET /api/vip/info?playerId=9197
Headers:
  access-key: KlfLcbxxLvfkUqOaUE0oFGXacmKV88Nl
  sign: DtTYrSLziisipiW0mWgRTDPuiw/LdHN1YQnYKqGxKsA=
```

#### **Response**

```json
{
    "data": {
        "level": 6,
        "currentTurnover": 0,
        "turnoverToNextLevel": 2500000,
        "nextLevel": 7
    },
    "code": 200,
    "success": true,
    "timestamp": "2025-10-14T10:08:14.133275+08:00"
}
```

---

## Transaction API

### Get Player Transaction Summary

**Function**: Retrieve deposit and withdrawal summary statistics for a player within a specified time range

**HTTP Method**: `POST`

**URI**: `/api/player/transaction-summary`

#### **Request Parameters**

Parameters are sent as a **JSON Body**.

|Parameter|Type|Required|Length|Description|Example|
|---|---|---|---|---|---|
|`playerId`|Long|Yes|-|Player ID|`23050`|
|`period`|String|No|-|Predefined period filter|`"LAST_3_MONTHS"`|
|`startTime`|DateTime|Yes|-|Start date with timezone|`"2025-01-01T00:00:00+08:00"`|
|`endTime`|DateTime|Yes|-|End date with timezone|`"2025-10-01T00:00:00+08:00"`|

**Date Format**: YYYY-MM-DDTHH:mm:ss+ZZ:ZZ (ISO 8601 with timezone)

#### **Request Example**

```http
POST /api/player/transaction-summary
Headers:
  access-key: KlfLcbxxLvfkUqOaUE0oFGXacmKV88Nl
  sign: [generated_signature]
  Content-Type: application/json
Body:
{
    "playerId": 23050,
    "period": "LAST_3_MONTHS",
    "startTime": "2025-01-01T00:00:00+08:00",
    "endTime": "2025-10-01T00:00:00+08:00"
}
```

#### **Response**

```json
{
    "data": {
        "totalDeposit": 200,
        "totalWithdrawal": 180
    },
    "code": 200,
    "success": true,
    "timestamp": "2025-10-14T10:06:43.202045+08:00"
}
```

---

## Promotion API

### Get Player Active Promotions List

**Function**: Retrieve the list of active promotions for a player with pagination support

**HTTP Method**: `POST`

**URI**: `/api/promotion/list`

#### **Request Parameters**

Parameters are sent as a **JSON Body**.

|Parameter|Type|Required|Length|Description|Example|
|---|---|---|---|---|---|
|`playerId`|Long|Yes|-|Player ID|`124`|
|`period`|String|No|-|Predefined period filter|`"LAST_3_MONTHS"`|
|`startTime`|DateTime|No|-|Start date with timezone|`"2024-01-01T00:00:00+08:00"`|
|`endTime`|DateTime|No|-|End date with timezone|`"2024-10-01T00:00:00+08:00"`|
|`pageNum`|Integer|No|-|Page number (default: 1)|`1`|
|`pageSize`|Integer|No|-|Items per page (default: 20)|`20`|

**Note**: The API uses `pageNum` for pagination, not `pageIndex`.

#### **Request Example**

```http
POST /api/promotion/list
Headers:
  access-key: KlfLcbxxLvfkUqOaUE0oFGXacmKV88Nl
  sign: [generated_signature]
  Content-Type: application/json
Body:
{
    "playerId": 124,
    "period": "LAST_3_MONTHS",
    "startTime": "2024-01-01T00:00:00+08:00",
    "endTime": "2024-10-01T00:00:00+08:00",
    "pageNum": 1,
    "pageSize": 20
}
```

#### **Response**

```json
{
    "records": [
        {
            "promotionId": "1988",
            "promotionName": "jamestest",
            "type": "RED_ENVELOPES",
            "currentTurnover": 0,
            "requiredTurnover": 10
        },
        {
            "promotionId": "1987",
            "promotionName": "jamestest",
            "type": "RED_ENVELOPES",
            "currentTurnover": 0,
            "requiredTurnover": 10
        },
        {
            "promotionId": "393",
            "promotionName": "Deposit_02",
            "type": "PROMOTION",
            "currentTurnover": 0,
            "requiredTurnover": 51.51
        },
        {
            "promotionId": "516",
            "promotionName": "Pengguna baru mendaftar langsung dapat 40.000!",
            "type": "PROMOTION",
            "currentTurnover": 0,
            "requiredTurnover": 120
        }
    ],
    "total": 8,
    "size": 20,
    "current": 1
}
```

**Promotion Types**:

- `RED_ENVELOPES`: Red envelope promotions
- `PROMOTION`: Standard promotions

---

## Withdrawal API

### Get Player Withdrawal Requirement

**Function**: Retrieve the withdrawal turnover requirement for a specific player

**HTTP Method**: `GET`

**URI**: `/api/player/withdrawal-requirement`

#### **Request Parameters**

Parameters are sent in the **Query String**.

|Parameter|Type|Required|Length|Description|Example|
|---|---|---|---|---|---|
|`playerId`|Long|Yes|-|Player ID|`24`|

#### **Request Example**

```http
GET /api/player/withdrawal-requirement?playerId=24
Headers:
  access-key: KlfLcbxxLvfkUqOaUE0oFGXacmKV88Nl
  sign: [generated_signature]
```

#### **Response**

```json
{
    "data": {
        "withdrawalRequirement": 69099.2
    },
    "code": 200,
    "success": true,
    "timestamp": "2025-10-14T10:04:15.6616757+08:00"
}
```

---

# Data Models

## Standard Response Format

All successful responses follow this structure:

|Field|Type|Description|
|---|---|---|
|`data`|Object/Array|Response data payload|
|`code`|Integer|HTTP status code|
|`success`|Boolean|Request success indicator|
|`timestamp`|String|ISO 8601 timestamp with timezone|

## VIP Information Object

|Field|Type|Description|
|---|---|---|
|`level`|Integer|Current VIP level|
|`currentTurnover`|Double|Current turnover amount|
|`turnoverToNextLevel`|Double|Turnover required for next level|
|`nextLevel`|Integer|Next VIP level|

## Transaction Summary Object

|Field|Type|Description|
|---|---|---|
|`totalDeposit`|Double|Total deposit amount|
|`totalWithdrawal`|Double|Total withdrawal amount|

## Promotion Object

|Field|Type|Description|
|---|---|---|
|`promotionId`|String|Unique promotion identifier|
|`promotionName`|String|Promotion display name|
|`type`|String|Promotion type (`RED_ENVELOPES`, `PROMOTION`)|
|`currentTurnover`|Double|Player's current turnover for this promotion|
|`requiredTurnover`|Double|Required turnover to complete promotion|

## Pagination Response Object

|Field|Type|Description|
|---|---|---|
|`records`|Array|Array of data records|
|`total`|Integer|Total number of records|
|`size`|Integer|Page size|
|`current`|Integer|Current page number|

## Withdrawal Requirement Object

|Field|Type|Description|
|---|---|---|
|`withdrawalRequirement`|Double|Required turnover amount before withdrawal|

---

# Notes

- All timestamps use timezone `+08:00` (system timezone)
- Date format follows ISO 8601 standard with timezone information
- Signature must be recalculated for each request using current parameters
- Empty, null, or undefined values are excluded from signature generation
- The API uses different pagination parameter names (`pageNum` vs `pageIndex`) depending on the endpoint