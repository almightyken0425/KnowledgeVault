# Overview  
  
This document provides comprehensive documentation for the INFO-API interfaces, including authentication, encryption methods, and all available endpoints.  
- All timestamps are in ISO 8601 format with timezone information
  
# Authentication  
  
## Headers Required  
  
All API requests must include the following headers:  
  
| Header | Description | Required | Example |  
|--------|-------------|----------|---------|  
| `access-key` | Partner access key for authentication | Yes | `partner_key_123` |  
| `sign` | HMAC-SHA256 signature for request verification | Yes | `AbC123...` |  
| `Content-Type` | Request content type | Yes | `application/json` |  
  
## Authentication Process  
  
1. **Access Key**: Provided by the platform administrator  
2. **Sign**: Generated using HMAC-SHA256 algorithm with request body and secret key  
3. **AgentId/AffiliateId**: Automatically injected by AuthFilter based on access-key  
  
# Encryption Methods  
  
## 1. Sign Encryption (HMAC-SHA256)  
  
Used for request signature verification to ensure data integrity and authenticity.  
  
### Algorithm: HMAC-SHA256  

- **Input**: Request body (JSON string) + Secret Key  

- **Output**: Base64-encoded signature string  
  
### Example Implementation:  

```javascript  
// Example request body  
const requestBody = {  
  "username": "player001",  "password": "encrypted_password_here",  "email": "player@example.com"};  
  
// Convert to JSON string  
const jsonString = JSON.stringify(requestBody);  
  
// Generate signature using HMAC-SHA256  
const secretKey = "your_secret_key_here";  
// Returns Base64 string 
const signature = hmacSHA256(jsonString, secretKey);  
  
// Add to request headers  
headers["sign"] = signature;  
```  
  
### Signature Generation Steps:  

1. Convert request body to JSON string (maintain exact format)  
2. Use HMAC-SHA256 with your secret key  
3. Encode result to Base64  
4. Include in `sign` header  
  
## 2. Password Encryption (AES-GCM)  
  
Used for encrypting sensitive data like passwords in request payloads.  
  
### Algorithm: AES-GCM with 256-bit key  

- **IV Length**: 12 bytes (randomly generated)  
- **Tag Length**: 128 bits  
- **Key Derivation**: SHA-256 of secret key  
  
### Example Implementation:  

```javascript  
// Encrypt password before sending  
const plainPassword = "user_password_123";  
const secretKey = "your_aes_secret_key";  
  
// AES-GCM encryption returns Base64 string with IV prefix  
const encryptedPassword = aesEncrypt(plainPassword, secretKey);  
  
// Use in request body  
const requestBody = {  
  "username": "player001",  "password": encryptedPassword  
  // AES-GCM encrypted and Base64 encoded
  };  
```  
  
### Encryption Process:  
1. Generate random 12-byte IV  
2. Derive 256-bit key using SHA-256 of secret key  
3. Encrypt using AES-GCM  
4. Prepend IV to ciphertext  
5. Encode to Base64  

----

# API Endpoints  
  
## Login API  
  
### Get All Failed Login Attempts  
  
**Function**: Retrieve failed login attempt records with filtering options  
  
**HTTP Method**: `GET`  
  
**URI**: `/api/login/getAllFailedLoginAttempts`  
  
#### **Request Parameters**

Parameters are sent in the **Query String**.
  
| Parameter | Type | Required | Length | Description | Example |  
|-----------|------|----------|--------|-------------|----------|  
| `limit` | Integer | No | - | Page size (default: 20) | `50` |  
| `page` | Integer | No | - | Page number (default: 1) | `1` |  
| `tag` | String | No | 50 | Filter tag | `"VIP"` |  
| `username` | String | No | 50 | Player username | `"player001"` |  
| `dateFrom` | DateTime | No | - | Start date | `"2024-01-01 00:00:00"` |  
| `dateTo` | DateTime | No | - | End date | `"2024-01-31 23:59:59"` |  
  
**Date Format**: YYYY-MM-DDTHH:mm:ss  
  
#### **Request Example**
```http  
GET /api/login/getAllFailedLoginAttempts?username=player001&limit=20&page=1  
Headers:  
  access-key: partner_key_123  sign: AbC123...
```  

#### **Response**
```json  
{  
  "data": 
  [    
	  {      
		  "id": 12345,      
		  "username": "player001",      
		  "date": "2024-01-15 10:30:00",      
		  "loginStatus": "FAILED",      
		  "accountStatus": "ACTIVE",      
		  "referrer": "https://partner.com",      
		  "ip": "192.168.1.100",      
		  "device": "Mobile",      
		  "clientEnd": "Android",      
		  "tag": ["VIP", "NEW"]    
		  }  
  ],  
  "totalElements": 1,  
  "totalPages": 1,  
  "size": 20
}  
```  

Note:
* limit between 90 days
* Date time use system zone +08:00

---
  
## Player API  
  
### Player Registration  
  
**Function**: Register new player account for partner sites  
  
**HTTP Method**: `POST`  
  
**URI**: `/api/player/register`  
  
#### **Request Parameters**

Parameters are sent as a **JSON Body**.
  
| Parameter | Type | Required | Length | Description | Example |  
|-----------|------|----------|--------|-------------|----------|  
| `username` | String | Yes | 50 | Username (alphanumeric only) | `"player001"` |  
| `password` | String | Yes | 50 | AES-GCM encrypted password | `"rKo7oH0T..."` |  
| `email` | String | No | 200 | Valid email address | `"player@example.com"` |  
| `phonenumber` | String | No | 20 | Phone number | `"+886988245107"` |  
  
#### **Request Example**

```http  
POST /api/player/register  
Headers:  
  access-key: partner_key_123  sign: AbC123...  Content-Type: application/json  
Body:  
{  
  "username": "player001",  
  "password": "rKo7oH0TTUub+xghsTm/ZEv85dEcGwkVQqN36GZoa/PZ3wE=",  
  "email": "player@example.com",  
  "phonenumber": "+886988245107"
}  
```  
  
#### **Response**

```json  
{
    "success": true,
    "code": 200,
    "message": "",
    "messageConstant": "SUCCESS",
    "data": {
        "messages": [],
        "playerId": 26197,
        "account": "player001",
        "email": "player@example.com",
        "phone": "+886988245107",
        "agentId": 7,
        "affiliateId": null,
        "languageId": null,
        "success": true
    },
    "exAction": "",
    "exActionData": ""
}
```  
  
* Email addresses and phone numbers must not be duplicated.
* Whether email and phone number are required fields is determined by backend configuration.

  
### Player Login  
  
**Function**: Authenticate player and return login session  
  
**HTTP Method**: `POST`  
  
**URI**: `/api/player/login`  
  
#### **Request Parameters**

Parameters are sent as a **JSON Body**.
  
| Parameter | Type | Required | Length | Description | Example |  
|-----------|------|----------|--------|-------------|----------|  
| `username` | String | Yes | 50 | Player username | `"player001"` |  
| `password` | String | Yes | 50 | AES-GCM encrypted password | `"rKo7oH0T..."` |
| `ip` | String | No | 50 | Player's IP. If omitted, defaults to the HTTP request's source IP. Supports IPv4/IPv6. | `"192.168.1.1"` |  
  
#### **Request Example**

```http  
POST /api/player/login  
Headers:  
  access-key: partner_key_123  sign: AbC123...  Content-Type: application/json  
Body:  
{  
  "username": "player001",  
  "password": "rKo7oH0TTUub+xghsTm/ZEv85dEcGwkVQqN36GZoa/PZ3wE="
}  
```  
  
#### **Response**

```json  
{
    "success": true,
    "code": 200,
    "message": "",
    "messageConstant": "SUCCESS",
    "data": {
        "account": "player001",
        "fullName": "",
        "token": "",
        "affiliate": "",
        "phone": "",
        "mail": "",
        "profileIntegrity": "N",
        "kycVerified": false,
        "haveBankCard": "N",
        "phoneVerified": "N",
        "mailVerified": "N",
        "createdTime": "2025-09-09 10:42:02",
        "avatar": 1,
        "allowReferral": false
    },
    "exAction": "",
    "exActionData": ""
} 
```  
  
Note:
* Date time use system zone +08:00

 ----
  
### Get All Players  
  
**Function**: Retrieve player list with complex filtering and pagination  
  
**HTTP Method**: `GET`  
  
**URI**: `/api/player/getAllPlayer`  
  
#### **Request Parameters**

Parameters are sent in the **Query String**.
  
| Parameter | Type | Required | Length | Description | Example |  
|-----------|------|----------|--------|-------------|----------|  
| `limit` | Integer | No | Max: 1000 | Page size (default: 20) | `100` |  
| `page` | Integer | No | - | Page number (default: 1) | `1` |  
| `username` | String | No | 50 | Filter by username | `"player001"` |  
| `tag` | String Array | No | - | Filter by tags | `["VIP","NEW"]` |  
| `dateFrom` | DateTime | No | - | Registration start date | `"2024-01-01 00:00:00"` |  
| `dateTo` | DateTime | No | - | Registration end date | `"2024-01-31 23:59:59"` |  
| `firstName` | String | No | 50 | Filter by first name | `"John"` |  
| `affiliate` | String | No | 50 | Filter by affiliate username | `"affiliate001"` |  
| `vipLevel` | String | No | 10 | Filter by VIP level | `"VIP1"` |  
| `email` | String | No | 200 | Filter by email | `"user@example.com"` |  
| `phoneNumber` | String | No | 20 | Filter by phone number | `"+886988245107"` |  
| `accountStatus` | String | No | 20 | Filter by account status | `"ACTIVE"` |  
  
**Date Format**: YYYY-MM-DDTHH:mm:ss  
  
#### **Request Example**

```http  
GET /api/player/getAllPlayer?limit=50&page=1 
Headers:  
  access-key: partner_key_123  sign: AbC123...
```  
  
#### **Response**

```json  
{
    "success": true,
    "code": 200,
    "message": "",
    "messageConstant": "SUCCESS",
    "data": {
        "username": "vk0602",
        "email": "vk0602@cc.cc",
        "playerId": 23124,
        "accountStatus": "ACTIVE",
        "createdAt": "2025-01-21 16:55:37",
        "firstName": "vk0602",
        "lastName": "vk0602",
        "phoneNumber": null,
        "imAccount1": null,
        "imAccount2": null,
        "imAccount3": null,
        "vipLevel": 0,
        "lastLoginTime": "2025-08-13 16:48:46",
        "tags": [
            "test",
            "test2",
            "hacker"
        ],
        "affiliate": null,
        "totalRevenueInMonth": 0,
        "netDepositInMonth": 0,
        "firstDepositDateInMonth": null,
        "lastDepositDate": "2025-01-21 16:56:09",
        "totalDepositRequest": 0,
        "totalDepositAmount": 200,
        "daysSinceLastDeposit": 233,
        "address": "TEST ADDRESS",
        "birthday": "2025-09-11"
    },
    "exAction": "",
    "exActionData": ""
}
```  

* Date time use system zone +08:00


----

### Get Player Profile  
  
**Function**: Retrieve detailed information for a specific player  
  
**HTTP Method**: `GET`  
  
**URI**: `/api/player/getPlayerProfile`  
  
#### **Request Parameters**

Parameters are sent in the **Query String**.
  
| Parameter | Type | Required | Length | Description | Example |  
|-----------|------|----------|--------|-------------|----------|  
| `username` | String | Yes | 50 | Player username | `"player001"` |  
  
#### **Request Example**

```http  
GET /api/player/getPlayerProfile?username=vk0602  
Headers:  
  access-key: partner_key_123  sign: AbC123...
```  


#### **Response**

```json  
{
    "success": true,
    "code": 200,
    "message": "",
    "messageConstant": "SUCCESS",
    "data": {
        "username": "vk0602",
        "email": "vk0602@cc.cc",
        "playerId": 23124,
        "accountStatus": "ACTIVE",
        "createdAt": "2025-01-21 16:55:37",
        "firstName": "vk0602",
        "lastName": "vk0602",
        "phoneNumber": null,
        "imAccount1": null,
        "imAccount2": null,
        "imAccount3": null,
        "vipLevel": 0,
        "lastLoginTime": "2025-08-13 16:48:46",
        "tags": [
            "test",
            "test2",
            "hacker"
        ],
        "affiliate": null,
        "totalRevenueInMonth": 0,
        "netDepositInMonth": 0,
        "firstDepositDateInMonth": null,
        "lastDepositDate": "2025-01-21 16:56:09",
        "totalDepositRequest": 0,
        "totalDepositAmount": 200,
        "daysSinceLastDeposit": 233,
        "address": "TEST ADDRESS",
        "birthday": "2025-09-11"
    },
    "exAction": "",
    "exActionData": ""
} 
```  


Note:
* Date time use system zone +08:00

---  
  
### Get Player Turnover Statistics  
  
**Function**: Retrieve player turnover statistics grouped by game type in dynamic format  
  
**HTTP Method**: `POST`  
  
**URI**: `/api/player/getTurnover`  
  
#### **Request Parameters**

Parameters are sent as a **JSON Body**.
  
| Parameter  | Type          | Required | Length | Description            | Example                       |
| ---------- | ------------- | -------- | ------ | ---------------------- | ----------------------------- |
| `dateFrom` | ZonedDateTime | Yes      | -      | Start date             | `"2020-01-30T16:00:00+08:00"` |
| `dateTo`   | ZonedDateTime | Yes      | -      | End date               | `"2026-05-31T15:00:00+08:00"` |
| `username` | String        | Yes      | 50     | Player username        | `"player001"`                 |
  
**Date Format**: YYYY-MM-DDTHH:mm:ssZ  
  
#### **Request Example**

```http  
POST /api/player/getTurnover  
Headers:  
  access-key: partner_key_123  sign: AbC123...  Content-Type: application/json  
Body:  
{  
  "dateFrom": "2020-01-30T16:00:00+08:00",  
  "dateTo": "2026-05-31T15:00:00+08:00",
  "username": "player001"
}  
```  
  
#### **Response**

```json  
{
    "total": 3671.2,
    "gameTypeAmounts": {
        "SLOTS": 3600,
        "CARDS": 71.2
    }
}
```  

Note:
* The data for this endpoint is sourced from aggregated statistical tables, not from real-time transaction data. Please account for potential data latency.

---  

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

Note: 
* The API uses `pageNum` for pagination, not `pageIndex`.

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

## Notification API

### Notes

- The `createdByIdentity` field distinguishes between player-sent messages ("PLAYER") and agent/system messages ("AGENT")
- Pagination follows standard format with `pageIndex` starting from 1
- All endpoints use POST method for requests
- The `usernameList` parameter in create notification accepts multiple usernames for bulk notifications
- Time range filtering is available in the agent list endpoint using `startTime` and `endTime` parameters

---

### Create Notification

**Function**: Send notification messages to multiple players with optional reply capability.

**Method**: `POST`  

**URI**: `/api/notification/create`

#### Request Parameters

| Parameter    | Type          | Required | Length | Description                         |
| ------------ | ------------- | -------- | ------ | ----------------------------------- |
| isReply      | Boolean       | Required | -      | Whether notification allows replies |
| title        | String        | Required | 1-100  | Notification title                  |
| content      | String        | Required | 1-500  | Notification content                |
| usernameList | Array[String] | Required | 1-500  | List of target usernames            |

#### Request Example

```json
{
    "isReply": true,
    "title": "title test",
    "content": "content test",
    "usernameList": ["dennistest2", "dennistest3"]
}
````

#### Response

```json
{
    "messageConstant": "SUCCESS",
    "data": {
        "failUsernameList": [],
        "failCount": 0,
        "errorDetails": null
    },
    "timestamp": "2025-09-23T14:54:56.2882782+08:00"
}
```

---

### Query Notification List (Agent)

**Function**: Retrieve paginated notifications for a specific user with time range filtering.

**Method**: `POST`  

**URI**: `/api/notification/agent/list`

#### Request Parameters

|Parameter|Type|Required|Range|Description|
|---|---|---|---|---|
|pageIndex|Integer|Required|≥1|Page number (starts from 1)|
|pageSize|Integer|Required|1-1000|Number of records per page|
|startTime|String|Required|-|Start time (ISO 8601 format)|
|endTime|String|Required|-|End time (ISO 8601 format)|
|username|String|Required|1-50|Target username|

#### Request Example

```json
{
    "pageIndex": 1,
    "pageSize": 1000,
    "startTime": "2025-01-30T16:00:00+08:00",
    "endTime": "2026-05-31T15:00:00+08:00",
    "username": "dennistest2"
}
```

#### Response

```json
{
    "messageConstant": "SUCCESS",
    "data": {
        "records": [
            {
                "id": 5344,
                "type": "PLAYER",
                "usernamesOrIds": "dennistest3,dennistest2",
                "title": "title test",
                "content": "content test",
                "isReply": true,
                "unreadCount": 0,
                "updatedBy": "INFO-API",
                "updatedTime": "2025-09-23T14:54:56.2882782+08:00"
            }
        ],
        "total": 7,
        "size": 1000,
        "current": 1,
        "exceedsPaginationLimit": false
    },
    "timestamp": "2025-09-23T14:54:56.2882782+08:00"
}
```

---

### Get Notification Messages

**Function**: Retrieve all messages for a specific notification. Messages are distinguished by `createdByIdentity` field.

**Method**: `POST`  

**URI**: `/api/notification/agent/subMsg`

#### Request Parameters

|Parameter|Type|Required|Description|
|---|---|---|---|
|playerNotificationId|Integer|Required|Notification ID|
|username|String|Required|Username|

#### Request Example

```json
{
    "playerNotificationId": 5344,
    "username": "dennistest3"
}
```

#### Response

```json
{
    "messageConstant": "SUCCESS",
    "data": [
        {
            "message": "test",
            "isRead": true,
            "createdBy": "INFO-API",
            "createdTime": "2025-09-23T14:54:56.2882782+08:00",
            "createdByIdentity": "AGENT"
        },
        {
            "message": "testP",
            "isRead": true,
            "createdBy": "INFO-API",
            "createdTime": "2025-09-23T14:54:56.2882782+08:00",
            "createdByIdentity": "PLAYER"
        }
    ],
    "timestamp": "2025-09-23T14:54:56.2882782+08:00"
}
```

---

### Send Message Reply (Agent)

**Function**: Send reply messages to a specific notification.

**Method**: `POST`  

**URI**: `/api/notification/agent/reply`

#### Request Parameters

|Parameter|Type|Required|Length|Description|
|---|---|---|---|---|
|playerNotificationId|Integer|Required|-|Notification ID|
|message|String|Required|1-500|Reply message content|
|username|String|Required|1-50|Username|

#### Request Example

```json
{
    "playerNotificationId": 5344,
    "message": "test",
    "username": "dennistest3"
}
```

#### Response

```json
{
    "messageConstant": "SUCCESS",
    "data": true,
    "timestamp": "2025-09-23T14:54:56.2882782+08:00"
}
```

---

### Mark Notification as Read (Agent)

**Function**: Mark a specific notification as read for an agent.

**Method**: `POST`  

**URI**: `/api/notification/agent/read`

#### Request Parameters

|Parameter|Type|Required|Description|
|---|---|---|---|
|playerNotificationId|Integer|Required|Notification ID to mark as read|
|username|String|Required|Username|

#### Request Example

```json
{
    "playerNotificationId": 5344,
    "username": "dennistest3"
}
```

#### Response

```json
{
    "messageConstant": "SUCCESS",
    "data": false,
    "timestamp": "2025-09-23T14:54:56.2882782+08:00"
}
```

---

# Data Models

## 1. Standard Response Wrappers

This section defines the outermost structure of API responses.

### Standard Response (General)

Used for VIP, Transaction, Promotion, Withdrawal APIs, etc.

|Field|Type|Description|
|---|---|---|
|`data`|Object/Array|Response data payload|
|`code`|Integer|HTTP status code|
|`success`|Boolean|Request success indicator|
|`timestamp`|String|ISO 8601 timestamp with timezone|

### Standard Response (Player)

Used for Player API (Register, Login, GetProfile, GetTurnover).

|Field|Type|Description|
|---|---|---|
|`success`|Boolean|Request success indicator|
|`code`|Integer|HTTP status code|
|`message`|String|Error message|
|`messageConstant`|String|Message constant identifier|
|`data`|Object/Array|Response data payload|
|`exAction`|String|Extra action identifier|
|`exActionData`|String|Extra action data|

### Standard Response (Notification)

Used for Notification API.

|Field|Type|Description|
|---|---|---|
|`messageConstant`|String|Message constant identifier|
|`data`|Object/Array/Boolean|Response data payload|
|`timestamp`|String|ISO 8601 timestamp of response|

---

## 2. Pagination Wrappers

This section defines the pagination object structure within the `data` field of list-type API responses.

### Pagination Response (Login)

Used for `GET /api/login/getAllFailedLoginAttempts`.

|Field|Type|Description|
|---|---|---|
|`data`|Array|Array of FailedLoginAttempt Object|
|`totalElements`|Integer|Total number of records|
|`totalPages`|Integer|Total number of pages|
|`size`|Integer|Number of records per page|

### Pagination Response (Promotion)

Used for `POST /api/promotion/list`. (Note: `getAllPlayer` likely uses this structure as well)

|Field|Type|Description|
|---|---|---|
|`records`|Array|Array of data records (e.g., Promotion Object])|
|`total`|Integer|Total number of records|
|`size`|Integer|Page size|
|`current`|Integer|Current page number|

### Pagination Response (Notification)

Used for `POST /api/notification/agent/list`.

|Field|Type|Description|
|---|---|---|
|`records`|Array|Array of Notification Object|
|`total`|Integer|Total number of records|
|`size`|Integer|Number of records per page|
|`current`|Integer|Current page number|
|`exceedsPaginationLimit`|Boolean|Whether pagination limit is exceeded|

---

## 3. Core Entity Models

This section defines the core data objects found within the `data` field or `records` array of API responses.

### FailedLoginAttempt Object

|Field|Type|Description|
|---|---|---|
|`id`|Integer|Log ID|
|`username`|String|Player username|
|`date`|String|Timestamp of login attempt|
|`loginStatus`|String|Login status (e.g., "FAILED")|
|`accountStatus`|String|Account status (e.g., "ACTIVE")|
|`referrer`|String|Referrer URL|
|`ip`|String|IP address|
|`device`|String|Device type (e.g., "Mobile")|
|`clientEnd`|String|Client type (e.g., "Android")|
|`tag`|Array[String]|Player tags|

### PlayerRegistration Data Object

|Field|Type|Description|
|---|---|---|
|`messages`|Array|Messages array|
|`playerId`|Integer|Newly created Player ID|
|`account`|String|Player username|
|`email`|String|Player email|
|`phone`|String|Player phone number|
|`agentId`|Integer|Agent ID|
|`affiliateId`|Integer|Affiliate ID|
|`languageId`|Integer|Language ID|
|`success`|Boolean|Registration success indicator|

### PlayerLogin Data Object

|Field|Type|Description|
|---|---|---|
|`account`|String|Player username|
|`fullName`|String|Player's full name|
|`token`|String|Session token (if applicable)|
|`affiliate`|String|Affiliate code|
|`phone`|String|Phone number|
|`mail`|String|Email address|
|`profileIntegrity`|String|Profile integrity status (e.g., "N")|
|`kycVerified`|Boolean|KYC verification status|
|`haveBankCard`|String|Bank card status (e.g., "N")|
|`phoneVerified`|String|Phone verification status (e.g., "N")|
|`mailVerified`|String|Email verification status (e.g., "N")|
|`createdTime`|String|Account creation timestamp|
|`avatar`|Integer|Avatar ID|
|`allowReferral`|Boolean|Referral allowance status|

### PlayerProfile Object

|Field|Type|Description|
|---|---|---|
|`username`|String|Player username|
|`email`|String|Player email|
|`playerId`|Integer|Player ID|
|`accountStatus`|String|Account status (e.g., "ACTIVE")|
|`createdAt`|String|Account creation timestamp|
|`firstName`|String|First name|
|`lastName`|String|Last name|
|`phoneNumber`|String|Phone number|
|`imAccount1`|String|IM Account 1|
|`imAccount2`|String|IM Account 2|
|`imAccount3`|String|IM Account 3|
|`vipLevel`|Integer|VIP level|
|`lastLoginTime`|String|Last login timestamp|
|`tags`|Array[String]|Player tags|
|`affiliate`|String|Affiliate username|
|`totalRevenueInMonth`|Double|Total revenue in month|
|`netDepositInMonth`|Double|Net deposit in month|
|`firstDepositDateInMonth`|String|First deposit timestamp in month|
|`lastDepositDate`|String|Last deposit timestamp|
|`totalDepositRequest`|Integer|Total number of deposit requests|
|`totalDepositAmount`|Double|Total deposit amount|
|`daysSinceLastDeposit`|Integer|Days since last deposit|
|`address`|String|Player address|
|`birthday`|String|Player birthday|

### PlayerTurnover Object

|Field|Type|Description|
|---|---|---|
|`total`|Double|Total turnover amount|
|`gameTypeAmounts`|Object|Key-value pairs of turnover by game type (e.g., "SLOTS": 3600)|

### VIP Information Object

|Field|Type|Description|
|---|---|---|
|`level`|Integer|Current VIP level|
|`currentTurnover`|Double|Current turnover amount|
|`turnoverToNextLevel`|Double|Turnover required for next level|
|`nextLevel`|Integer|Next VIP level|

### Transaction Summary Object

|Field|Type|Description|
|---|---|---|
|`totalDeposit`|Double|Total deposit amount|
|`totalWithdrawal`|Double|Total withdrawal amount|

### Promotion Object

|Field|Type|Description|
|---|---|---|
|`promotionId`|String|Unique promotion identifier|
|`promotionName`|String|Promotion display name|
|`type`|String|Promotion type (`RED_ENVELOPES`, `PROMOTION`)|
|`currentTurnover`|Double|Player's current turnover for this promotion|
|`requiredTurnover`|Double|Required turnover to complete promotion|

### Withdrawal Requirement Object

|Field|Type|Description|
|---|---|---|
|`withdrawalRequirement`|Double|Required turnover amount before withdrawal|

### Notification Object

|Field|Type|Description|
|---|---|---|
|`id`|Integer|Unique notification identifier|
|`type`|String|Notification type (e.g., "PLAYER")|
|`usernamesOrIds`|String|Comma-separated list of usernames/IDs|
|`title`|String|Notification title|
|`content`|String|Notification content|
|`isReply`|Boolean|Whether notification allows replies|
|`unreadCount`|Integer|Number of unread messages|
|`updatedBy`|String|Username of last updater|
|`updatedTime`|String|ISO 8601 timestamp of last update|

### Message Object

|Field|Type|Description|
|---|---|---|
|`message`|String|Message content (max 500 characters)|
|`isRead`|Boolean|Whether message has been read|
|`createdBy`|String|Username of message creator|
|`createdTime`|String|ISO 8601 timestamp of creation|
|`createdByIdentity`|String|Identity type: "PLAYER" for player messages, "AGENT" for agent messages|

### CreateNotification Data Object

|Field|Type|Description|
|---|---|---|
|`failUsernameList`|Array|List of usernames that failed to receive notification|
|`failCount`|Integer|Number of failed deliveries|
|`errorDetails`|String/null|Error details if any failures occurred|

---

# Notes

- All timestamps use timezone `+08:00` (system timezone)
- Date format follows ISO 8601 standard with timezone information
- Signature must be recalculated for each request using current parameters
- Empty, null, or undefined values are excluded from signature generation
- The API uses different pagination parameter names (`pageNum` vs `pageIndex`) depending on the endpoint
 
---
  
# Rate Limiting  
  
- **Default Limit**: 60 requests per minute per access-key  
  
---

# Security Best Practices  
  
- **Always use HTTPS** for API requests  
- **Keep secret keys secure** and rotate regularly  
- **Validate signatures** on every request  
- **Encrypt sensitive data** using AES-GCM  
- **Implement proper error handling** to avoid information leakage  
- **Monitor rate limits** and implement backoff strategies  
- **Log security events** for audit purposes  

---

# Appendix

## AesEncryptionUtils Sample Code

### Java

```java
package com.sit.ogp.info.api.util;

  

import java.nio.charset.StandardCharsets;

import java.security.SecureRandom;

import java.util.Base64;

import javax.crypto.Cipher;

import javax.crypto.spec.GCMParameterSpec;

import javax.crypto.spec.SecretKeySpec;

import lombok.Builder;

import lombok.Data;

import lombok.experimental.UtilityClass;

import lombok.extern.slf4j.Slf4j;

import org.apache.commons.codec.digest.DigestUtils;

  

/** AES Encryption Utility Class - Performs encryption/decryption using external secret_key */

@Slf4j

@UtilityClass

public final class AesEncryptionUtils {

  

  private static final String AES_ALGORITHM = "AES/GCM/NoPadding";

  // Recommended IV length for GCM

  private static final int IV_LENGTH = 12;

  // 256-bit key

  private static final int KEY_LENGTH = 32;

  // GCM authentication tag length

  private static final int TAG_LENGTH_BIT = 128;

  

  private static final int KEY_HASH_PREFIX_LENGTH = 8;

  private static final int AES_MIN_SECRET_KEY_LENGTH = 16;

  

  /**

   * Encrypts plaintext using AES-GCM and returns a Base64 encoded ciphertext (with IV prefix).

   *

   * <p>This method generates a random IV, uses the provided secret key to perform AES-GCM

   * encryption, prepends the IV to the ciphertext, then returns the Base64 encoded result.

   *

   * <ul>

   *   <li>If inputs are null, logs a warning and returns null.

   *   <li>On failure (e.g., encryption error), logs an error including a key hash and returns null.

   * </ul>

   *

   * @param plainText Plaintext to encrypt

   * @param secretKey Secret key string

   * @return Base64 encoded AES-GCM ciphertext with IV prefix, or null on failure

   */

  public static String encrypt(String plainText, String secretKey) {

    if (plainText == null || secretKey == null) {

      log.warn("Encrypt failed: plainText or secretKey is null");

      return null;

    }

    try {

      byte[] iv = generateRandomIV();

      byte[] key = deriveKey(secretKey);

  

      var cipher = Cipher.getInstance(AES_ALGORITHM);

      var keySpec = new SecretKeySpec(key, "AES");

      var gcmSpec = new GCMParameterSpec(TAG_LENGTH_BIT, iv);

  

      cipher.init(Cipher.ENCRYPT_MODE, keySpec, gcmSpec);

      byte[] cipherText = cipher.doFinal(plainText.getBytes(StandardCharsets.UTF_8));

  

      var combined = new byte[IV_LENGTH + cipherText.length];

      System.arraycopy(iv, 0, combined, 0, IV_LENGTH);

      System.arraycopy(cipherText, 0, combined, IV_LENGTH, cipherText.length);

  

      return Base64.getEncoder().encodeToString(combined);

    } catch (Exception e) {

      log.error(

          "Encryption failed (keyHash={}): {}",

          DigestUtils.sha256Hex(secretKey).substring(0, KEY_HASH_PREFIX_LENGTH),

          e.getMessage(),

          e);

      return null;

    }

  }

  

  /**

   * Decrypts Base64 encoded AES-GCM ciphertext (with IV prefix).

   *

   * <p>Uses guard clauses for readability. Returns null on invalid input or decryption failure.

   *

   * @param encryptedData Base64 encoded ciphertext (with IV prefix)

   * @param secretKey Secret key string

   * @return Decrypted plaintext or null if input is invalid or decryption fails

   */

  public static String decrypt(String encryptedData, String secretKey) {

    String result = null;

    if (encryptedData == null || secretKey == null) {

      log.warn("Decrypt failed: encryptedData or secretKey is null");

    } else {

      try {

        byte[] combined = Base64.getDecoder().decode(encryptedData);

        if (combined.length < IV_LENGTH) {

          log.warn("Invalid encrypted data length: {}", combined.length);

        } else {

          var iv = new byte[IV_LENGTH];

          var cipherText = new byte[combined.length - IV_LENGTH];

          System.arraycopy(combined, 0, iv, 0, IV_LENGTH);

          System.arraycopy(combined, IV_LENGTH, cipherText, 0, cipherText.length);

  

          byte[] key = deriveKey(secretKey);

  

          var cipher = Cipher.getInstance(AES_ALGORITHM);

          var keySpec = new SecretKeySpec(key, "AES");

          var gcmSpec = new GCMParameterSpec(TAG_LENGTH_BIT, iv);

  

          cipher.init(Cipher.DECRYPT_MODE, keySpec, gcmSpec);

          byte[] plainText = cipher.doFinal(cipherText);

          result = new String(plainText, StandardCharsets.UTF_8);

        }

      } catch (Exception e) {

        log.error(

            "Decryption failed (keyHash={}): {}",

            DigestUtils.sha256Hex(secretKey).substring(0, KEY_HASH_PREFIX_LENGTH),

            e.getMessage(),

            e);

      }

    }

    return result;

  }

  

  /**

   * Checks whether the provided secret key meets the minimum AES length requirement.

   *

   * @param secretKey Key to validate

   * @return true if valid (not null and >= 16 characters); false otherwise

   */

  public static boolean isValidSecretKey(String secretKey) {

    return secretKey != null && secretKey.length() >= AES_MIN_SECRET_KEY_LENGTH;

  }

  

  private static byte[] deriveKey(String secretKey) {

    return DigestUtils.sha256(secretKey);

  }

  

  private static byte[] generateRandomIV() {

    var iv = new byte[IV_LENGTH];

    new SecureRandom().nextBytes(iv);

    return iv;

  }

  

  /**

   * Generates a secure random AES key and returns it in Base64 format.

   *

   * @return Base64 encoded AES key string

   */

  public static String generateSecretKey() {

    var key = new byte[KEY_LENGTH];

    new SecureRandom().nextBytes(key);

    return Base64.getEncoder().encodeToString(key);

  }

  

  /**

   * Tests AES encryption/decryption for correctness and timing.

   *

   * @param data Plaintext input to test

   * @param secretKey AES secret key

   * @return EncryptionTestResult with all details

   */

  public static EncryptionTestResult testEncryption(String data, String secretKey) {

    long start = System.currentTimeMillis();

    String encrypted = encrypt(data, secretKey);

    long encTime = System.currentTimeMillis() - start;

  

    if (encrypted == null) {

      return EncryptionTestResult.builder().success(false).error("Encryption failed").build();

    }

  

    start = System.currentTimeMillis();

    String decrypted = decrypt(encrypted, secretKey);

    long decTime = System.currentTimeMillis() - start;

  

    boolean success = data.equals(decrypted);

  

    return EncryptionTestResult.builder()

        .success(success)

        .originalData(data)

        .encryptedData(encrypted)

        .decryptedData(decrypted)

        .encryptTimeMs(encTime)

        .decryptTimeMs(decTime)

        .encryptedLength(encrypted.length())

        .error(success ? null : "Decryption mismatch")

        .build();

  }

  

  /** Result structure for encryption test, including correctness, timing, and error info. */

  @Builder

  @Data

  public static class EncryptionTestResult {

    private boolean success;

    private String originalData;

    private String encryptedData;

    private String decryptedData;

    private long encryptTimeMs;

    private long decryptTimeMs;

    private int encryptedLength;

    private String error;

  }

  

  //  public static void main(String[] args) {

  //    System.out.println(encrypt("rron123", "HyGbC/ldd+svV835bzp6gRyxswWN0KJvOg+8LtkP9d8="));

  //  }

  

}
```

---

### PHP

```php
<?php

class AesEncryptionUtils
{
    private const AES_ALGORITHM = 'aes-256-gcm';
    private const IV_LENGTH = 12; // Recommended IV length for GCM
    private const KEY_LENGTH = 32; // 256-bit key
    private const TAG_LENGTH = 16; // GCM authentication tag length (128 bits / 8 = 16 bytes)
    private const KEY_HASH_PREFIX_LENGTH = 8;
    private const AES_MIN_SECRET_KEY_LENGTH = 16;

    /**
     * Encrypts plaintext using AES-GCM and returns a Base64 encoded ciphertext (with IV prefix).
     *
     * This method generates a random IV, uses the provided secret key to perform AES-GCM
     * encryption, prepends the IV to the ciphertext, then returns the Base64 encoded result.
     *
     * @param string|null $plainText Plaintext to encrypt
     * @param string|null $secretKey Secret key string
     * @return string|null Base64 encoded AES-GCM ciphertext with IV prefix, or null on failure
     */
    public static function encrypt(?string $plainText, ?string $secretKey): ?string
    {
        if ($plainText === null || $secretKey === null) {
            error_log('Encrypt failed: plainText or secretKey is null');
            return null;
        }

        try {
            $iv = self::generateRandomIV();
            $key = self::deriveKey($secretKey);
            $tag = '';

            $cipherText = openssl_encrypt(
                $plainText,
                self::AES_ALGORITHM,
                $key,
                OPENSSL_RAW_DATA,
                $iv,
                $tag
            );

            if ($cipherText === false) {
                throw new Exception('OpenSSL encryption failed');
            }

            // Combine IV + ciphertext + authentication tag
            $combined = $iv . $cipherText . $tag;

            return base64_encode($combined);

        } catch (Exception $e) {
            $keyHash = substr(hash('sha256', $secretKey), 0, self::KEY_HASH_PREFIX_LENGTH);
            error_log("Encryption failed (keyHash={$keyHash}): " . $e->getMessage());
            return null;
        }
    }

    /**
     * Decrypts Base64 encoded AES-GCM ciphertext (with IV prefix).
     *
     * @param string|null $encryptedData Base64 encoded ciphertext (with IV prefix)
     * @param string|null $secretKey Secret key string
     * @return string|null Decrypted plaintext or null if input is invalid or decryption fails
     */
    public static function decrypt(?string $encryptedData, ?string $secretKey): ?string
    {
        if ($encryptedData === null || $secretKey === null) {
            error_log('Decrypt failed: encryptedData or secretKey is null');
            return null;
        }

        try {
            $combined = base64_decode($encryptedData, true);
            if ($combined === false) {
                throw new Exception('Invalid base64 data');
            }

            $combinedLength = strlen($combined);
            if ($combinedLength < self::IV_LENGTH + self::TAG_LENGTH) {
                error_log("Invalid encrypted data length: {$combinedLength}");
                return null;
            }

            // Separate IV, ciphertext and authentication tag
            $iv = substr($combined, 0, self::IV_LENGTH);
            $cipherTextWithTag = substr($combined, self::IV_LENGTH);
            $cipherText = substr($cipherTextWithTag, 0, -self::TAG_LENGTH);
            $tag = substr($cipherTextWithTag, -self::TAG_LENGTH);

            $key = self::deriveKey($secretKey);

            $plainText = openssl_decrypt(
                $cipherText,
                self::AES_ALGORITHM,
                $key,
                OPENSSL_RAW_DATA,
                $iv,
                $tag
            );

            if ($plainText === false) {
                throw new Exception('OpenSSL decryption failed');
            }

            return $plainText;

        } catch (Exception $e) {
            $keyHash = substr(hash('sha256', $secretKey), 0, self::KEY_HASH_PREFIX_LENGTH);
            error_log("Decryption failed (keyHash={$keyHash}): " . $e->getMessage());
            return null;
        }
    }

    /**
     * Checks whether the provided secret key meets the minimum AES length requirement.
     *
     * @param string|null $secretKey Key to validate
     * @return bool true if valid (not null and >= 16 characters); false otherwise
     */
    public static function isValidSecretKey(?string $secretKey): bool
    {
        return $secretKey !== null && strlen($secretKey) >= self::AES_MIN_SECRET_KEY_LENGTH;
    }

    /**
     * Generates a secure random AES key and returns it in Base64 format.
     *
     * @return string Base64 encoded AES key string
     */
    public static function generateSecretKey(): string
    {
        $key = random_bytes(self::KEY_LENGTH);
        return base64_encode($key);
    }

    /**
     * Tests AES encryption/decryption for correctness and timing.
     *
     * @param string $data Plaintext input to test
     * @param string $secretKey AES secret key
     * @return EncryptionTestResult EncryptionTestResult with all details
     */
    public static function testEncryption(string $data, string $secretKey): EncryptionTestResult
    {
        $start = microtime(true);
        $encrypted = self::encrypt($data, $secretKey);
        $encTime = (microtime(true) - $start) * 1000; // Convert to milliseconds

        if ($encrypted === null) {
            return new EncryptionTestResult([
                'success' => false,
                'error' => 'Encryption failed'
            ]);
        }

        $start = microtime(true);
        $decrypted = self::decrypt($encrypted, $secretKey);
        $decTime = (microtime(true) - $start) * 1000; // Convert to milliseconds

        $success = $data === $decrypted;

        return new EncryptionTestResult([
            'success' => $success,
            'originalData' => $data,
            'encryptedData' => $encrypted,
            'decryptedData' => $decrypted,
            'encryptTimeMs' => $encTime,
            'decryptTimeMs' => $decTime,
            'encryptedLength' => strlen($encrypted),
            'error' => $success ? null : 'Decryption mismatch'
        ]);
    }

    /**
     * Derives key using SHA256 hash
     *
     * @param string $secretKey Original key
     * @return string Derived 32-byte key
     */
    private static function deriveKey(string $secretKey): string
    {
        return hash('sha256', $secretKey, true);
    }

    /**
     * Generates random IV
     *
     * @return string Random IV bytes
     */
    private static function generateRandomIV(): string
    {
        return random_bytes(self::IV_LENGTH);
    }
}

/**
 * Encryption test result class
 */
class EncryptionTestResult
{
    public bool $success;
    public ?string $originalData;
    public ?string $encryptedData;
    public ?string $decryptedData;
    public float $encryptTimeMs;
    public float $decryptTimeMs;
    public int $encryptedLength;
    public ?string $error;

    public function __construct(array $data)
    {
        $this->success = $data['success'] ?? false;
        $this->originalData = $data['originalData'] ?? null;
        $this->encryptedData = $data['encryptedData'] ?? null;
        $this->decryptedData = $data['decryptedData'] ?? null;
        $this->encryptTimeMs = $data['encryptTimeMs'] ?? 0.0;
        $this->decryptTimeMs = $data['decryptTimeMs'] ?? 0.0;
        $this->encryptedLength = $data['encryptedLength'] ?? 0;
        $this->error = $data['error'] ?? null;
    }

    public function toArray(): array
    {
        return [
            'success' => $this->success,
            'originalData' => $this->originalData,
            'encryptedData' => $this->encryptedData,
            'decryptedData' => $this->decryptedData,
            'encryptTimeMs' => $this->encryptTimeMs,
            'decryptTimeMs' => $this->decryptTimeMs,
            'encryptedLength' => $this->encryptedLength,
            'error' => $this->error
        ];
    }
}

// Usage examples
/*
// Generate key
$secretKey = AesEncryptionUtils::generateSecretKey();
echo "Generated key: " . $secretKey . "\n";

// Encrypt
$plainText = "Hello, World!";
$encrypted = AesEncryptionUtils::encrypt($plainText, $secretKey);
echo "Encrypted: " . $encrypted . "\n";

// Decrypt
$decrypted = AesEncryptionUtils::decrypt($encrypted, $secretKey);
echo "Decrypted: " . $decrypted . "\n";

// Test
$testResult = AesEncryptionUtils::testEncryption($plainText, $secretKey);
echo "Test result: " . json_encode($testResult->toArray(), JSON_PRETTY_PRINT) . "\n";

// Validate key
$isValid = AesEncryptionUtils::isValidSecretKey($secretKey);
echo "Key is valid: " . ($isValid ? 'Yes' : 'No') . "\n";
*/

?>
```

---

## HmacSHA256Utils Sample Code

### Java

```java
package com.sit.ogp.info.api.util;

  

import com.sit.ogp.info.api.exception.HmacSHA256Exception;

import java.nio.charset.StandardCharsets;

import java.util.Base64;

import javax.crypto.Mac;

import javax.crypto.spec.SecretKeySpec;

import lombok.experimental.UtilityClass;

  

/**

 * HmacSHA256Utils is a utility class for generating and verifying HMAC-SHA256 signatures.

 *

 * <p>Recommended for: API request signing, sensitive data validation, anti-tampering, and similar

 * use cases.

 *

 * <p>All methods are thread-safe static methods.

 *

 * <p>Example usage:

 *

 * <pre>

 * String data = "hello";

 * String key = "secret";

 * String signature = HmacSHA256Utils.sign(data, key);

 * boolean valid = HmacSHA256Utils.verify(data, key, signature);

 * </pre>

 */

@UtilityClass

public class HmacSHA256Utils {

  

  private final String HMAC_SHA256 = "HmacSHA256";

  

  /**

   * Generates a HMAC-SHA256 signature for the given data and key, and returns a Base64-encoded

   * string.

   *

   * @param data Content to sign, must not be null

   * @param key Secret key, must not be null

   * @return Base64-encoded signature string

   * @throws IllegalArgumentException if data or key is null

   */

  public String sign(String data, String key) {

    if (data == null || key == null) {

      throw new IllegalArgumentException("data and key must not be null");

    }

    try {

      var mac = Mac.getInstance(HMAC_SHA256);

      var secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), HMAC_SHA256);

      mac.init(secretKey);

      byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));

      return Base64.getEncoder().encodeToString(hash);

    } catch (java.security.NoSuchAlgorithmException | java.security.InvalidKeyException e) {

      // These exceptions indicate misconfiguration or invalid key; rethrow as runtime exception

      throw new HmacSHA256Exception("Failed to calculate HMAC-SHA256", e);

    }

  }

  

  /**

   * Verifies that the provided HMAC-SHA256 signature matches the data and key.

   *

   * @param data Original data, must not be null

   * @param key Secret key, must not be null

   * @param signature Base64-encoded signature to verify, must not be null

   * @return true if verification succeeds, false otherwise

   * @throws IllegalArgumentException if any argument is null

   */

  public boolean verify(String data, String key, String signature) {

    if (data == null || key == null || signature == null) {

      throw new IllegalArgumentException("data, key and signature must not be null");

    }

    String calculated = sign(data, key);

    // Prevent timing attacks using constant-time comparison

    return java.security.MessageDigest.isEqual(

        calculated.getBytes(StandardCharsets.UTF_8), signature.getBytes(StandardCharsets.UTF_8));

  }

  

  /**

   * Converts a byte array to a lowercase hexadecimal string.

   *

   * @param bytes Input byte array

   * @return Lowercase hexadecimal string

   */

  public String toHex(byte[] bytes) {

    var sb = new StringBuilder(bytes.length * 2);

    for (byte b : bytes) {

      sb.append(String.format("%02x", b));

    }

    return sb.toString();

  }

  

  /**

   * Returns the raw HMAC-SHA256 signature as a byte array.

   *

   * @param data Data to sign

   * @param key Secret key

   * @return Signature as byte array

   * @throws IllegalArgumentException if data or key is null

   */

  public byte[] signBytes(String data, String key) {

    if (data == null || key == null) {

      throw new IllegalArgumentException("data and key must not be null");

    }

    try {

      var mac = Mac.getInstance(HMAC_SHA256);

      var secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), HMAC_SHA256);

      mac.init(secretKey);

      return mac.doFinal(data.getBytes(StandardCharsets.UTF_8));

    } catch (java.security.NoSuchAlgorithmException | java.security.InvalidKeyException e) {

      throw new HmacSHA256Exception("Failed to calculate HMAC-SHA256", e);

    }

  }

  

  //  public static void main(String[] args) {

  //    String data =

  //            "{\n"

  //                    + "  \"username\" : \"ron123\",\n"

  //                    + "  \"password\" : \"rKo7oH0TTUub+xghsTm/ZEv85dEcGwkVQqN36GZoa/PZ3wE=\",\n"

  //                    + "  \"email\" : \"ron123@gamil.com\",\n"

  //                    + "  \"phonenumber\" : \"11111111111\"\n"

  //                    + "}";

  //    String key = "HyGbC/ldd+svV835bzp6gRyxswWN0KJvOg+8LtkP9d8=";

  //    String signature = HmacSHA256Utils.sign(data, key);

  //    System.out.println(signature);

  //    boolean v = verify(data, key, signature);

  //    System.out.println(v);

  //  }

}
```