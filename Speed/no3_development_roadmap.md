# 開發路線圖

---

## 核心願景

**真實世界 1:1 比例開放世界賽車遊戲**

玩家在與現實世界完全相同的開放世界中駕駛、探索、競技與社交。無主線設計理念，強調玩家自由度與個人化遊戲體驗。

---

## 玩家核心旅程

- 進入真實世界地圖
- 獲得初始車輛
- 探索真實地點與道路
- 客製化改裝車輛
- 參與競技賽事
- 社交互動與分享

---

## 遊戲引擎模組

### 核心可重用模組識別

- **VehiclePhysicsEngine** 物理引擎
- **OpenWorldStreamingEngine** 開放世界引擎
- **VehicleCustomizationSystem** 車輛客製化系統
- **MultiplayerSocialSystem** 多人互動系統
- **RaceEventSystem** 賽事系統
- **AdvancedRenderingEngine** 渲染引擎
- **DynamicAudioEngine** 音效引擎
- **InputControlSystem** 輸入控制系統
- **TrafficSimulationSystem** NPC 交通系統
- **RouteEditorSystem** 路線編輯器
- **RoadAnalysisAISystem** AI 道路分析

---

## 開發策略

### 優先開發模組

**VehiclePhysicsEngine 物理引擎**

- **優先原因:** 整個遊戲的核心基礎，所有駕駛相關功能的依賴
- **配套模組:** InputControlSystem + 基礎 AdvancedRenderingEngine
- **目標成果:** 建立最小可玩原型，驗證核心駕駛手感

### 建議開發順序

- 核心駕駛體驗原型
- 車輛客製化與多樣性
- 開放世界探索
- 競技與賽事系統
- 多人社交互動

### 高風險項目識別

- **VehiclePhysicsEngine:** 物理調校極度複雜，需大量測試與迭代
- **MultiplayerSocialSystem:** 網路同步技術挑戰與伺服器成本高昂
- **OpenWorldStreamingEngine:** 真實世界地圖資料處理與串流優化

---

## 物理引擎測試環境策略

### 核心挑戰

物理引擎開發需要道路與車輛資料，但這些系統尚未完成。需要建立獨立測試環境，驗證物理模擬核心功能，同時避免對其他模組的依賴。

### 測試道路環境

#### 程序化測試賽道

**目標:** 零依賴驗證物理核心邏輯

**實作方式:**
- 程式碼直接生成簡單幾何形狀作為測試場地
- 包含平面、坡道、圓形測試場、標準彎道組合
- 硬編碼路面參數值

**路面參數設定:**
- 柏油路面摩擦係數: 0.8
- 濕滑路面摩擦係數: 0.4
- 冰面摩擦係數: 0.1

**可測試項目:**
- 基礎加速與煞車物理
- 轉向響應與輪胎抓地力
- 打滑模擬與重心轉移
- 車體姿態變化
- 碰撞邊界偵測

**程式碼範例:**
```csharp
void GenerateTestTrack() {
    GameObject flatZone = GameObject.CreatePrimitive(PrimitiveType.Plane);
    flatZone.GetComponent<TerrainSurface>().frictionCoefficient = 0.8f;
    
    GameObject slope = CreateSlope(angle: 15f, length: 100f);
    GameObject skidPad = CreateCircularTrack(radius: 50f);
}
```

#### 簡化地形系統

**目標:** 提供更真實測試場景，仍不依賴完整地圖系統

**實作方式:**
- 建立基礎高度圖地形
- 手動設計測試路線: 髮夾彎、S彎、長直線
- 區域化材質系統定義不同路面物理屬性

**可測試項目:**
- 坡度對加速與煞車的影響
- 高低差對懸吊系統的響應
- 不同路面材質的摩擦力切換
- 離開賽道的懲罰機制

**資料結構範例:**
```json
{
  "terrainZones": [
    {
      "zoneId": "asphalt_sector_1",
      "surfaceType": "asphalt",
      "frictionCoefficient": 0.85,
      "bumpiness": 0.02,
      "elevation": 120.5
    },
    {
      "zoneId": "gravel_trap_1",
      "surfaceType": "gravel",
      "frictionCoefficient": 0.4,
      "bumpiness": 0.3,
      "elevation": 119.0
    }
  ]
}
```

#### Mock 道路資料介面

**目標:** 物理引擎與道路系統解耦，易於測試與未來整合

**實作方式:**
- 定義物理引擎所需的道路資料介面
- 建立 Mock 實作回傳測試資料
- OpenWorldStreamingEngine 未來實作同一介面即可替換

**介面設計:**
```csharp
public interface IRoadDataProvider {
    float GetFrictionAt(Vector3 position);
    float GetSlopeAt(Vector3 position);
    Vector3 GetSurfaceNormalAt(Vector3 position);
    RoadMaterial GetMaterialAt(Vector3 position);
}

public class MockRoadDataProvider : IRoadDataProvider {
    public float GetFrictionAt(Vector3 pos) {
        return 0.8f;
    }
}

public class OpenWorldRoadDataProvider : IRoadDataProvider {
    // 從真實地圖系統讀取資料
}
```

**優勢:**
- 物理引擎與道路系統完全解耦
- 支援單元測試與 CI/CD 整合
- 未來替換真實系統無痛整合

### 測試車輛實體

#### 簡化剛體車輛

**目標:** 物理引擎開發初期，提供最小化可測試實體

**實作方式:**
- 車體以單一剛體表示，不包含懸吊系統
- 四個輪胎碰撞點，硬編碼物理參數
- 基礎輸入映射: 油門、煞車、轉向

**車輛參數設定:**
- 質量: 1500 kg
- 重心偏移: Vector3(0, -0.3f, 0)
- 空氣阻力係數: 0.3
- 輪胎摩擦係數: 1.0
- 最大轉向角度: 35 degrees

**可測試項目:**
- 基礎移動與轉向響應
- 重心影響車體姿態
- 摩擦力與速度關係
- 碰撞反彈行為

**程式碼範例:**
```csharp
public class SimpleRigidBodyVehicle : MonoBehaviour {
    public Rigidbody body;
    public WheelCollider[] wheels;
    
    void FixedUpdate() {
        float throttle = Input.GetAxis("Vertical");
        float steering = Input.GetAxis("Horizontal");
        
        ApplyThrottle(throttle);
        ApplySteering(steering);
    }
}
```

#### 基礎物理車輛

**目標:** 引入懸吊與輪胎物理，驗證進階物理模擬

**實作方式:**
- 獨立懸吊彈簧系統
- 個別輪胎摩擦力計算
- 引擎扭力曲線與變速箱模擬

**可測試項目:**
- 懸吊壓縮與回彈
- 輪胎側滑與打滑
- 引擎轉速與檔位切換
- 進階車體動態: 重心轉移、抬頭煞車

**資料結構範例:**
```json
{
  "vehiclePhysics": {
    "suspensionStiffness": 35000,
    "suspensionDamping": 4500,
    "suspensionTravel": 0.3,
    "wheelMass": 20,
    "tireFrictionCurve": {
      "peakSlip": 0.15,
      "peakForce": 1.0,
      "tailSlip": 0.8,
      "tailForce": 0.6
    }
  }
}
```

#### 完整車輛系統整合

**目標:** 連接 VehicleCustomizationSystem，測試客製化對物理的影響

**實作方式:**
- 車輛參數由客製化系統提供，不再硬編碼
- 改裝零件影響質量分佈、引擎性能、輪胎抓地力
- 支援多種車輛類型物理預設

**測試項目:**
- 改裝零件對操控的影響
- 不同車型的物理表現差異
- 極端客製化組合的穩定性

### 演進路徑

#### 測試道路演進

- **程序化測試賽道:** 物理引擎開發初期，驗證核心數學模型
- **簡化地形系統:** 物理引擎進階調校，測試真實場景表現
- **Mock 道路資料介面:** 準備整合真實地圖前，建立穩定介面
- **真實地圖整合:** OpenWorldStreamingEngine 完成後，實作 IRoadDataProvider 介面即可無縫接軌

#### 測試車輛演進

- **簡化剛體車輛:** 物理引擎開發初期，驗證核心移動與轉向邏輯
- **基礎物理車輛:** 物理引擎進階開發，實作懸吊與輪胎物理
- **完整車輛系統整合:** VehicleCustomizationSystem 完成後，整合客製化參數
- **真實車輛資料:** 取得真實車輛規格後，調校物理參數匹配真實表現

#### 整合測試環境演進

- **階段一:** 程序化測試賽道 + 簡化剛體車輛
- **階段二:** 簡化地形系統 + 基礎物理車輛
- **階段三:** Mock 道路資料介面 + 完整車輛系統
- **階段四:** 真實地圖整合 + 完整車輛系統

---

## 下一步行動

### 立即執行

- 開始 VehiclePhysicsEngine 詳細規格撰寫
- 定義物理引擎的資料結構與介面
- 研究現有物理引擎解決方案: Unity WheelCollider、PhysX Vehicle SDK

### 後續規劃

- 依模組優先順序逐步撰寫詳細規格
- 建立技術驗證原型
- 評估第三方引擎與工具整合可行性
- 建立測試環境與自動化測試框架
