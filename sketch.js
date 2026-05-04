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
    // 定義多組點位序列（包含外唇與內唇）
    let paths = [
      [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291],
      [76, 77, 90, 180, 85, 16, 315, 404, 320, 307, 306, 408, 304, 303, 302, 11, 72, 73, 74, 184]
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
