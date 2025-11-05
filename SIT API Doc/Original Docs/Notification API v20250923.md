## Endpoints

### 1. Create Notification
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

### 2. Query Notification List (Agent)

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

### 3. Get Notification Messages

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

### 4. Send Message Reply (Agent)

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

### 5. Mark Notification as Read (Agent)

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

## Data Models

### Standard Response Format

|Field|Type|Description|
|---|---|---|
|messageConstant|String|Message constant identifier|
|data|Object/Array/Boolean|Response data payload|
|timestamp|String|ISO 8601 timestamp of response|

### Notification Object

|Field|Type|Description|
|---|---|---|
|id|Integer|Unique notification identifier|
|type|String|Notification type (e.g., "PLAYER")|
|usernamesOrIds|String|Comma-separated list of usernames/IDs|
|title|String|Notification title|
|content|String|Notification content|
|isReply|Boolean|Whether notification allows replies|
|unreadCount|Integer|Number of unread messages|
|updatedBy|String|Username of last updater|
|updatedTime|String|ISO 8601 timestamp of last update|

### Message Object

|Field|Type|Description|
|---|---|---|
|message|String|Message content (max 500 characters)|
|isRead|Boolean|Whether message has been read|
|createdBy|String|Username of message creator|
|createdTime|String|ISO 8601 timestamp of creation|
|createdByIdentity|String|Identity type: "PLAYER" for player messages, "AGENT" for agent messages|

### Pagination Response Object

|Field|Type|Description|
|---|---|---|
|records|Array|Array of Notification Objects|
|total|Integer|Total number of records|
|size|Integer|Number of records per page|
|current|Integer|Current page number|
|exceedsPaginationLimit|Boolean|Whether pagination limit is exceeded|

### Create Notification Response Data

|Field|Type|Description|
|---|---|---|
|failUsernameList|Array|List of usernames that failed to receive notification|
|failCount|Integer|Number of failed deliveries|
|errorDetails|String/null|Error details if any failures occurred|

## Notes

- All timestamps are in ISO 8601 format with timezone information
- The `createdByIdentity` field distinguishes between player-sent messages ("PLAYER") and agent/system messages ("AGENT")
- Pagination follows standard format with `pageIndex` starting from 1
- All endpoints use POST method for requests
- HMAC-SHA256 signature authentication is required for all requests
- The `usernameList` parameter in create notification accepts multiple usernames for bulk notifications
- Time range filtering is available in the agent list endpoint using `startTime` and `endTime` parameters