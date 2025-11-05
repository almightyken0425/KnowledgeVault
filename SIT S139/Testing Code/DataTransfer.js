const fs = require('fs');
const path = require('path');

// --- 設定 ---
// !! 請務必修改這裡的路徑，指向您實際的 JSON 檔案位置 !!
const filePaths = [
  './mockdata/CurrencyRate.json',     // 相對於 DataTransfer.js 的路徑
  './mockdata/Schedule.json',    // 相對於 DataTransfer.js 的路徑
  './mockdata/Transfer.json', // 相對於 DataTransfer.js 的路徑
  // 如果您還有 Transfer.json, Schedule.json 等在 mockdata 資料夾內，也加入它們：
  // './mockdata/Transfer.json',
  // './mockdata/Schedule.json',
  // './mockdata/CurrencyRate.json',
];

// 需要轉換的欄位名稱列表
const timestampKeys = [
  'CreatedOn',
  'DeletedOn',
  'DisabledOn',
  'RateDate', // CurrencyRate.json
  'StartOn',  // Schedule.json
  'EndOn',    // Schedule.json
];

const DOTNET_TICKS_OFFSET = 621355968000000000;
const TICKS_PER_MILLISECOND = 10000;

// --- 轉換函數 ---
function convertTicksToMillis(ticks) {
  if (typeof ticks !== 'number' || ticks < DOTNET_TICKS_OFFSET) {
    // 如果不是數字或是看起來不像有效的 .NET Ticks，保持原樣
    // 您也可以選擇返回 null 或 0，但保持原樣可能更安全以便檢查
    return ticks;
  }
  // 進行轉換並四捨五入到最接近的毫秒整數
  return Math.round((ticks - DOTNET_TICKS_OFFSET) / TICKS_PER_MILLISECOND);
}

// --- 主處理邏輯 ---
filePaths.forEach(filePath => {
  const absolutePath = path.resolve(__dirname, filePath); // 獲取絕對路徑
  console.log(`\nProcessing file: ${filePath}`);

  try {
    // 讀取檔案
    const fileContent = fs.readFileSync(absolutePath, 'utf8');

    // 解析 JSON
    let data;
    try {
      data = JSON.parse(fileContent);
    } catch (parseError) {
      console.error(`  Error parsing JSON: ${parseError.message}. Skipping file.`);
      return; // 跳過這個檔案
    }

    // 確保是陣列
    if (!Array.isArray(data)) {
      console.error('  Error: JSON data is not an array. Skipping file.');
      return;
    }

    let convertedCount = 0;
    // 遍歷數據並轉換時間戳
    data.forEach(item => {
      timestampKeys.forEach(key => {
        if (item.hasOwnProperty(key) && item[key] !== null) {
          const originalValue = item[key];
          const convertedValue = convertTicksToMillis(originalValue);
          if (originalValue !== convertedValue) { // 只有在實際轉換發生時才更新和計數
              item[key] = convertedValue;
              convertedCount++;
              // console.log(`  Converted ${key}: ${originalValue} -> ${convertedValue}`); // 可選：顯示詳細轉換
          }
        }
      });
    });

    if (convertedCount > 0) {
      // 將修改後的數據寫回檔案 (使用 2 空格縮排美化)
      fs.writeFileSync(absolutePath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`  Successfully processed and saved. Converted ${convertedCount} timestamps.`);
    } else {
      console.log('  No timestamps needed conversion or found in this file.');
    }

  } catch (fileError) {
    if (fileError.code === 'ENOENT') {
      console.error(`  Error: File not found at ${absolutePath}. Skipping.`);
    } else {
      console.error(`  Error processing file: ${fileError.message}. Skipping.`);
    }
  }
});

console.log('\nTimestamp conversion process finished.');