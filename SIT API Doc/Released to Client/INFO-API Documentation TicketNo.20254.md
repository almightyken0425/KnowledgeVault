```toc
```
# API Endpoints  
## Player API  
### Player Login  
  
**Function**: Authenticate player and return login session  
  
**HTTP Method**: `POST`  
  
**URI**: `/api/player/login`  
  
**Request Parameters** (JSON Body):  
  
| Parameter | Type | Required | Length | Description | Example |  
|-----------|------|----------|--------|-------------|----------|  
| `username` | String | Yes | 50 | Player username | `"player001"` |  
| `password` | String | Yes | 50 | AES-GCM encrypted password | `"rKo7oH0T..."` |  
  
**Request Example**:  
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
  
**Normal Response**:  
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
  
### Get Player Profile  
  
**Function**: Retrieve detailed information for a specific player  
  
**HTTP Method**: `GET`  
  
**URI**: `/api/player/getPlayerProfile`  
  
**Request Parameters** (Query String):  
  
| Parameter | Type | Required | Length | Description | Example |  
|-----------|------|----------|--------|-------------|----------|  
| `username` | String | Yes | 50 | Player username | `"player001"` |  
  
**Request Example**:  
```http  
GET /api/player/getPlayerProfile?username=vk0602  
Headers:  
  access-key: partner_key_123  sign: AbC123...
```  


**Normal Response**:  
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
  
## Player Hourly Report API   
### Get Player Turnover Statistics  
  
**Function**: Retrieve player turnover statistics grouped by game type in dynamic format  
  
**HTTP Method**: `POST`  
  
**URI**: `/api/player/getTurnover`  
  
**Request Parameters** (JSON Body):  
  
| Parameter | Type | Required | Length | Description | Example |  
|-----------|------|----------|--------|-------------|----------|  
| `dateFrom` | ZonedDateTime | Yes | - | Start date | `"2020-01-30T16:00:00+08:00"` |  
| `dateTo` | ZonedDateTime | Yes | - | End date | `"2026-05-31T15:00:00+08:00"` |  
| `agentId` | Long | Yes | - | Agent ID (must be > 0) | `12345` |  
| `playerId` | Long | Yes | - | Player ID | `123456` |  
| `username` | String | Yes | 50 | Player username | `"player001"` |  
  
**Date Format**: YYYY-MM-DDTHH:mm:ssZ  
  
**Request Example**:  
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
  
**Normal Response**:  
```json  
{
    "total": 3671.2,
    "gameTypeAmounts": {
        "SLOTS": 3600,
        "CARDS": 71.2
    }
}
```  

----