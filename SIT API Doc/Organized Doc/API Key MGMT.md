# **Prod Environment**
- **Domain:** https://crmapi1.ogp77.xyz/info-api/
- **AgentCode:** `BA001`
- **AgentID:** `PLAYME8ID`
	- **Access Key:** `oLfPzBMcEdcYOFPm1eT2ncNTjdO0KdHt`
	- **Secret Key:** `4HKLRK9yvC3833EOkG0jGEVfwhEcaJazwIdt3K5lgDg=`

- **AgentCode:** `BA032`
- **AgentID:** `HAOLIID`
	- **Access Key:** `Tnok0qMz8pr8DhuvhZ6tHDxWAix1BoYh`
	- **Secret Key:** `2TESFm9fHDA68ane81lUXkrnedZmELwhiCEJRb2oXbA=`
	- **Allowed APIs:**
		- **Login API**
			- `GET` `/api/login/getAllFailedLoginAttempts`
		- **Player API**
			- `POST` `/api/player/login`
			- `GET` `/api/player/getAllPlayer`
			- `GET` `/api/player/getPlayerProfile`
			- `POST` `/api/player/getTurnover`
		- **Notification API**
			- `POST` `/api/notification/create`
			- `POST` `/api/notification/agent/list`

# **UAT Environment**
- **Domain:** https://crmapi1.ogp99.xyz/info-api/
- **AgentID:** `OLEID2`
	- **Access Key:** `KlfLcbxxLvfkUqOaUE0oFGXacmKV88Nl`
	- **Secret Key:** `UgLQOi741DXlJkvfGhr1/2/ytiKUBq/gcs7qYvUI8Zc=`
	- **Allowed APIs:**
		- **Login API**
			- `GET` `/api/login/getAllFailedLoginAttempts`
		- **Player API**
			- `POST` `/api/player/register`
			- `POST` `/api/player/login`
			- `GET` `/api/player/getAllPlayer`
			- `GET` `/api/player/getPlayerProfile`
			- `POST` `/api/player/getTurnover`
		- **Notification API**
			- `POST` `/api/notification/create`
			- `POST` `/api/notification/agent/list`
			- `POST` `/api/notification/agent/subMsg`
			- `POST` `/api/notification/agent/reply`
			- `POST` `/api/notification/agent/read`

