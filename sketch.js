let capture;

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  // 擷取攝影機影像
  capture = createCapture(VIDEO);
  // 隱藏預設的影片元件，只在畫布上顯示
  capture.hide();
}

function draw() {
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
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
