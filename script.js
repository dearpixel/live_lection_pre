// Общие функции
function rnd(max) {
  return Math.floor(Math.random() * max);
}
function rnd2(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}
function percent(value) {
  return rnd(100.0) < value;
}
function gen_fileName() {
  let fileName = "";
  for (let i = 0; i < 20; i += 1) {
    if (percent(50)) fileName += String.fromCharCode(rnd2(48, 57));
    else if (percent(51)) fileName += String.fromCharCode(rnd2(65, 90));
    else fileName += String.fromCharCode(rnd2(97, 122));
  }
  return fileName;
}

function UrlExists(url) {
  // Файл или путь существует
  let http = new XMLHttpRequest();
  http.open("HEAD", url, false);
  http.send();
  return http.status != 404;
}

function input(text) {
  // Запрос текста
  let result = "";
  while (result == null || result.length < 1) {
    result = prompt(text);
    if (result == null || result.length < 1)
      alert("Название слайда должно состоять, как минимум, из 1 символа!");
  }
  return result;
}

// Кнопки и прочие элементы страницы
let video = document.getElementById("video");
let recordButton = document.getElementById("start_recording");
let stopButton = document.getElementById("stop_recording");
let playButton = document.getElementById("play_button");
let projectName = document.getElementById("projectName");
let slideName = document.getElementById("slideName");
let renameButton = document.getElementById("projectName");
let delSlideButton = document.getElementById("delSlideButton");
let newSlideButton = document.getElementById("newSlideButton");
let undoButton = document.getElementById("undo");
let redoButton = document.getElementById("redo");
let undoImg = document.getElementById("undoImg");
let redoImg = document.getElementById("redoImg");
let pageSlides = document.getElementById("slideList");
let canvas = document.getElementById("canvas");
let penSizeChanger = document.getElementById("size");
let penColorChanger = document.getElementById("color");
let fileUploadButton = document.getElementById("file-upload-button");
let image = document.getElementById("image");
let rec_circle = document.querySelector(".rec_circle");
let sendPicButton = document.getElementById("sendPicture");
let debugline = document.getElementById("debug");

let userID = 45; // ID пользователя, пока абстрактный

// Содержит все действия подряд
class CStep {
  constructor() {
    this.stepPath = ""; // path to picture of step
    this.time = 0; // time since start recording to show this 
  }
  get getStep() {
    return this.stepPath;
  }
}

class CSlide {
  constructor(name) {
    this.name = name;
    this.videoPath = "";
    this.done = false;
    this.currStep = 0; // current step
    this.steps = [];
    this.steps[this.pos] = new CStep();
  }
  get getStep() {
    return this.steps[this.currStep];
  }
}

class CLection {
  constructor(name, ownerID) {
    this.name = name;
    this.ownerID = ownerID;
    this.currSlide = 0; // current slide
    this.slides = [];
    this.slides[this.pos] = new CSlide();
  }
  get getSlide() {
    return this.slides[this.currSlide];
  }
  set pushSlide(newSlide) {
    let nSlide = new CSlide(newSlide);
    this.slides.push(nSlide);
  }
}

let lection = new CLection('random', userID);

// Содержит список действий для отмены
class CEditeData {
  constructor() {
    this.undoList = [];
    this.undoID = 0;
  }

  get getUndo() {
    return undoList[undoID];
  }

  get getFUndo() {
    return undoList;
  }

  set setUndo(new_undoID) {
    this.undoID = new_undoID;
  }
}

let edit = new CEditeData();

// Переменные и константы
let context = canvas.getContext("2d");
let penSize = 3; // Размер кисти
let penColor = "#000"; // Цвет кисти
let lastX = 0;
let lastY = 0;
let hue = 0;
let isDrawing = false;
let isRecording = false;
let mediaRecorder; // Писатель
let chunks = []; // Для записи видео

function updateArrows() {
  if (undoList[slideID].length == 0) {
    undoImg.src = "/resources/images/undoOff.png";
    redoImg.src = "/resources/images/redoOff.png";
  } else {
    if (undoID > 0) {
      undoImg.src = "/resources/images/undo.png";
    } else {
      undoImg.src = "/resources/images/undoOff.png";
    }
    if (undoID < undoList[slideID].length - 1) {
      redoImg.src = "/resources/images/redo.png";
    } else {
      redoImg.src = "/resources/images/redoOff.png";
    }
  }
}

function update_slideList() {
  // Обновить поле со слайдами
  pageSlides.innerHTML = "<ol>";
  for (let i = 0; i < lection.slides.length; i++) {
    let done = "";
    if (lection.getSlide.done) done = " ✓";
    if (i == lection.currSlide)
      pageSlides.innerHTML +=
        "<li class=line onclick=change_slide_name(" +
        i +
        ")><strong>" +
        lection.slides[i].name +
        done +
        "</strong></li>";
    else
      pageSlides.innerHTML +=
        "<li class=line onclick=update_slide(" +
        i +
        ")>" +
        lection.slides[i].name +
        done +
        "</li>";
  }
  pageSlides.innerHTML += "</ol>";
}

function updatePage() {
  // Обновляет все кнопки
  //updateArrows();
  update_slideList();
}

function login() {
  console.log('login function');
}

function gen_slideList() {
  // Генерация тестового списка слайдов
  for (let i = 0; i < 100; i++) {
    lection.pushSlide = "Слайд " + i;
  }
  update_slideList();
  slideName.innerHTML = lection.getSlide.name;
}

function add_frame() {
  // Добавление кадра для отмены
  if (edit.getFUndo[slideID][0] != null) {
    undoList[slideID].length = undoID + 1;
  }
  let newFrame = [
    context.getImageData(0, 0, canvas.width, canvas.height),
    Date.now(),
  ];
  undoList[slideID] = undoList[slideID].slice(0, undoID + 1);
  undoList[slideID].push(newFrame);
  edit.setUndo = edit.undoList[slideID].length - 1;
  updatePage();
}

function onImageChange(e) {
  // Изменение рисунка
  e.preventDefault();
  let file = image.files[0];
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    const img = new Image();
    img.src = reader.result;
    img.onload = () => {
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      //add_frame();
    };
    recordButton.disabled = false;
  };
  let formData = new FormData(this);
  let tmpFileName = gen_fileName();
  let tmpFilePath = "lections/image/" + tmpFileName + ".jpeg";
  while (UrlExists(tmpFilePath)) {
    tmpFileName = gen_fileName();
    tmpFilePath = "lections/image/" + tmpFileName + ".jpeg";
  }
  formData.append("filename", tmpFileName);
  fetch("saveImg.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.text())
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  set_slide(lection.currSlide, 2, tmpFilePath);
}

function start_drawing(e) {
  // Начало рисования
  if (!isRecording) return;
  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
}

function drawing(e) {
  // Процесс рисования
  if (!isDrawing || !isRecording) return;
  context.strokeStyle = penColor;
  context.lineWidth = penSize;
  context.lineCap = "round";
  context.beginPath();
  context.moveTo(lastX, lastY);
  context.lineTo(e.offsetX, e.offsetY);
  context.stroke();
  [lastX, lastY] = [e.offsetX, e.offsetY];
}

function stop_drawing() {
  // Прекращение рисования
  if (!isRecording) return;
  redoImg.src = "/resources/images/redoOff.png";
  isDrawing = false;
  add_frame();
}

function undo() {
  // Отмена действия
  if (undoID <= 0) return;
  undoID--;
  context.putImageData(undoList[slideID][undoID][0], 0, 0);
  updatePage();
}

function redo() {
  // Повтор действия
  if (undoID >= undoList[slideID].length - 1) return;
  undoID++;
  context.putImageData(undoList[slideID][undoID][0], 0, 0);
  updatePage();
}

function start_recording() {
  // Начало записи
  if (lection.getSlide == "pictureURL") return;
  stopButton.disabled = false;
  isRecording = recordButton.disabled = true;
  rec_circle.style.display = "block"; // Анимация записи видео
  mediaRecorder.start();
  video.controls = false;
  //undoList = null;
  add_frame();
}

function onStopMediaRecorder() {
  // Остановка и сохранение записи, обновление страницы
  stopButton.disabled = true;
  isRecording = recordButton.disabled = false;
  playButton.style = "display: inline";
  rec_circle.style.display = "none"; // Анимация записи видео
  mediaRecorder.stop();
  const mediaBlob = new Blob(chunks, { type: "video/webm" });
  let formData = new FormData();
  formData.append("voice", mediaBlob);
  let tmpFileName = gen_fileName();
  let tmpFilePath = "lections/video/" + tmpFileName + ".webm";
  while (UrlExists(tmpFilePath)) {
    tmpFileName = gen_fileName();
    tmpFilePath = "lections/video/" + tmpFileName + ".webm";
  }
  formData.append("filename", tmpFileName);
  fetch("saveVideo.php", { method: "POST", body: formData });
  chunks = [];
  set_slide(slideID, 1, tmpFilePath);
  set_slide(slideID, 3, "yes");
  video.srcObject = null;
  video.src = tmpFilePath;
  video.controls = true;
}

function play_lection() {
  // Воспроизведение видео и пометок
}

function set_slide(num, num2, value) {
  // Задать данные слайда
  let slide = slideList[num].split(", ");
  slide[num2] = value;
  slideList[num] = "";
  for (let i = 0; i < slide.length; i++) {
    slideList[num] += slide[i];
    if (i < slide.length - 1) slideList[num] += ", ";
  }
  update_slideList();
}

function initVideo() {
  // Инициализация видео
  navigator.mediaDevices
    .getUserMedia({ audio: true, video: true })
    .then((stream) => {
      video.srcObject = stream;
      window.stream = stream;
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = onStopMediaRecorder;
    });
}

function update_slide(num) {
  // Переключение на заданный слайд
  if (num < 0 || num > slideList.length - 1) return;
  // Смена картинки и видео
  let img = new Image();
  if (UrlExists(lection.getSlide.done)) {
    img.src = lection.getSlide.done;
    img.onload = () =>
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
  } else {
    context.clearRect(0, 0, canvas.width, canvas.height);
    recordButton.disabled = true;
  }
  if (UrlExists(lection.getSlide.videoPath)) {
    video.src = lection.getSlide.videoPath;
    initVideo();
    video.controls = false;
  }
  if (lection.getSlide.done) playButton.style = "display: inline";
  else playButton.style = "display: none";
  slideID = num;
  slideName.innerHTML = lection.getSlide.name;
  update_slideList();
}

function del_slide() {
  // Удалить слайд
  if (slideList.length > 1) {
    slideList.splice(slideID, 1);
    if (slideID == slideList.length) slideID--;
    update_slide(slideID);
  } else alert("Остался всего один слайд!");
}

function new_slide() {
  // Создать слайд
  slideID++;
  slideList.splice(
    slideID,
    slideList.length - slideID,
    input("Введите название нового слайда") + ", videoURL, pictureURL, no"
  );
  update_slide(slideID);
}

function change_slide_name(num) {
  // Изменить название слайда
  set_slide(num, 0, input("Введите новое название слайда"));
  slideName.innerHTML = lection.getSlide.name;
}

// Инициализация
login();
gen_slideList();
initVideo();
updatePage();

// Действия по событию
recordButton.onclick = start_recording;
stopButton.onclick = () => mediaRecorder.stop();
renameButton.onclick = () =>
(projectName.innerHTML =
  "Название проекта: " + input("Введите название проекта"));
playButton.onclick = play_lection;
newSlideButton.onclick = new_slide;
delSlideButton.onclick = del_slide;
undoButton.onclick = undo;
redoButton.onclick = redo;
canvas.onmousedown = start_drawing;
canvas.onmousemove = drawing;
canvas.onmouseup = stop_drawing;
canvas.onmouseout = () => (isDrawing = false);
penSizeChanger.onchange = () => (penSize = penSizeChanger.value);
penColorChanger.onchange = () => (penColor = penColorChanger.value);
fileUploadButton.onclick = () => image.click();
image.onchange = () => sendPicButton.click();
document.querySelector("form").addEventListener("submit", onImageChange);

document.addEventListener("keydown", (e) => {
  // Управление с клавиатуры
  //alert(e.code);
  if (e.code === "Delete") {
    del_slide();
  } else if (e.ctrlKey && e.shiftKey && e.code === "KeyZ") {
    redo();
  } else if (e.ctrlKey && e.code === "KeyZ") {
    undo();
  } else if (e.shiftKey && e.code === "KeyN") {
    new_slide();
  } else if (e.code === "ArrowUp") {
    update_slide(slideID - 1);
  } else if (e.code === "ArrowDown") {
    update_slide(slideID + 1);
  }
});
