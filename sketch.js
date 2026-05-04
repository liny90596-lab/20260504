let capture;
let faceMesh;
let faces = [];

function preload() {
  // 檢查 ml5 是否成功載入
  if (typeof ml5 !== 'undefined') {
    // 載入 FaceMesh 模型
    faceMesh = ml5.faceMesh();
  } else {
    console.error("錯誤：ml5 函式庫未載入。請檢查網路連線，並確保已儲存 index.html。");
  }
}

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  // 擷取攝影機影像
  capture = createCapture(VIDEO);
  // 設定攝影機解析度，確保座標對應準確
  capture.size(640, 480); 
  // 隱藏預設的影片元件，只在畫布上顯示
  capture.hide();
  
  // 確保 faceMesh 物件存在再啟動偵測
  if (faceMesh && capture) {
    // 開始偵測臉部
    faceMesh.detectStart(capture, gotFaces);
  }
}

function gotFaces(results) {
  faces = results;
}

function draw() {
  // 如果 ml5 沒載入，在畫面上顯示提示文字
  if (typeof ml5 === 'undefined') {
    background(255, 0, 0);
    fill(255);
    textSize(20);
    textAlign(CENTER);
    text("ml5.js 載入失敗，請檢查網路並使用 Live Server", width/2, height/2);
    return;
  }

  // 設定背景顏色
  background('#e7c6ff');

  let displayW = width * 0.5;
  let displayH = height * 0.5;

  push();
  // 將座標原點移至畫面中心
  translate(width / 2, height / 2);
  // 水平翻轉（左右顛倒）
  scale(-1, 1);
  // 將影像置中繪製，寬高為全螢幕的 50%
  imageMode(CENTER);
  image(capture, 0, 0, displayW, displayH);

  // 繪製指定的臉部線條，並確保影像寬高已讀取
  if (faces.length > 0 && capture.width > 0) {
    let keypoints = faces[0].keypoints;
    // 定義多組點位序列（嘴唇與眼睛輪廓）
    let paths = [
      // 嘴唇點位
      [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291],
      [76, 77, 90, 180, 85, 16, 315, 404, 320, 307, 306, 408, 304, 303, 302, 11, 72, 73, 74, 184],
      // 左眼內圈 (包含 246)
      [33, 246, 161, 160, 159, 158, 157, 173, 133, 155, 154, 153, 145, 144, 163, 7],
      // 左眼外圈 (包含 247)
      [130, 247, 30, 29, 27, 28, 56, 190, 243, 112, 26, 22, 23, 24, 110, 245],
      // 右眼內圈 (對應 246 位置)
      [263, 466, 388, 387, 386, 385, 384, 398, 362, 382, 381, 380, 374, 373, 390, 249],
      // 右眼外圈 (對應 247 位置)
      [359, 467, 260, 259, 257, 258, 286, 414, 463, 341, 256, 252, 253, 254, 339, 255]
    ];
    
    noFill();
    stroke('red');
    strokeWeight(1);

    for (let indices of paths) {
      for (let i = 0; i < indices.length; i++) {
        let p1 = keypoints[indices[i]];
        // 串接下一個點，最後一個點接回第一個點形成閉合
        let p2 = keypoints[indices[(i + 1) % indices.length]];

        if (p1 && p2) {
          let x1 = map(p1.x, 0, capture.width, -displayW / 2, displayW / 2);
          let y1 = map(p1.y, 0, capture.height, -displayH / 2, displayH / 2);
          let x2 = map(p2.x, 0, capture.width, -displayW / 2, displayW / 2);
          let y2 = map(p2.y, 0, capture.height, -displayH / 2, displayH / 2);
          line(x1, y1, x2, y2);
        }
      }
    }
  }
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
