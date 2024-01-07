// Общие функции
function rnd(max) {
  return Math.floor(Math.random() * max);
}
function rnd2(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}
function percent(value) {
  if (rnd(100.0) < value) return true;
  else return false;
}
function gen_fileName() {
  let fileName = "";
  for (let i = 0; i < 20; i += 1) {
    if (percent(50)) fileName += String.fromCharCode(rnd2(48, 57));
    else if (percent(50)) fileName += String.fromCharCode(rnd2(65, 90));
    else fileName += String.fromCharCode(rnd2(97, 122));
  }
  return fileName;
}

// Файл или путь существует
function UrlExists(url) {
  var http = new XMLHttpRequest();
  http.open("HEAD", url, false);
  http.send();
  return http.status != 404;
}

// Запрос текста
function input(text) {
  let result = prompt(text);
  if (result == null || result.length < 1)
    alert("Название слайда должно состоять, как минимум, из 1 символа!");
  else return result;
}

// Кнопки и прочие элементы страницы
let video = document.getElementById("video");
let recordButton = document.getElementById("start_recording");
let stopButton = document.getElementById("stop_recording");
let playButton = document.getElementById("play_button");
let projectName = document.getElementById("projectName");
let slideName = document.getElementById("slideName");
let renameButton = document.getElementById("renameNutton");
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

// Переменные и константы
let context = canvas.getContext("2d");
let lastX = 0,
  lastY = 0,
  hue = 0,
  slideID = 0,
  undoID = 0;
let isDrawing = false,
  isRecording = false;
let mediaRecorder; // Писатель
let chunks = []; // Для записи видео
let undoList = []; // Для отмены действий на полотне
let lectionList = []; // Для хранения информации о лекциях
let penSize = 3; // Размер кисти
let penColor = "#000"; // Цвет кисти
let slideList = []; // 3 индикатор завершённости слайда (4 адрес сценария пометок)

function updateDebug() {
  // Обновление информации для дебага
  debugline.innerHTML =
    "Шаг: " +
    undoID +
    "<br>" +
    "Слайд: " +
    slideID +
    "<br>" +
    "Длина списка отмены: " +
    undoList.length +
    "<br>" +
    "Название слайда: " +
    get_slide(slideID, 0) +
    "<br>" +
    "Адрес видео: " +
    get_slide(slideID, 1) +
    "<br>" +
    "Адрес картинки: " +
    get_slide(slideID, 2) +
    "<br>" +
    "Слайд готов: " +
    get_slide(slideID, 3) +
    "<br>";
}

function updateArrows() {
  if (undoList.length == 0) {
    undoImg.src = "/resources/images/undoOff.png";
    redoImg.src = "/resources/images/redoOff.png";
  } else {
    if (undoID > 0) {
      undoImg.src = "/resources/images/undo.png";
    } else {
      undoImg.src = "/resources/images/undoOff.png";
    }
    if (undoID < undoList.length - 1) {
      redoImg.src = "/resources/images/redo.png";
    } else {
      redoImg.src = "/resources/images/redoOff.png";
    }
  }
}

function update_slideList() {
  // Обновить поле со слайдами
  pageSlides.innerHTML = "<ol>";
  for (i = 0; i < slideList.length; i++) {
    let done = "";
    if (get_slide(i, 3) == "yes") done = " ✓";
    if (i == slideID)
      pageSlides.innerHTML +=
        "<li class=line onclick=change_slide_name(" +
        i +
        ")><strong>" +
        get_slide(i, 0) +
        done +
        "</strong></li>";
    else
      pageSlides.innerHTML +=
        "<li class=line onclick=update_slide(" +
        i +
        ")>" +
        get_slide(i, 0) +
        done +
        "</li>";
  }
  pageSlides.innerHTML += "</ol>";
}

function updatePage() {
  // Обновляет все кнопки и инфу
  updateDebug();
  updateArrows();
  update_slideList();
}

function login() {
  // Авторизация и загрузка лекций пользователя
}

function load_profile() {
  // Загрузка профиля пользователя
}

function load_lection_list() {
  // Загрузка списка лекций пользователя
}

function gen_slideList() {
  // Генерация тестового списка слайдов
  for (let i = 0; i < 100; i++) {
    slideList.push("Слайд " + i + ", videoURL, pictureURL, no");
  }
}
function load_slideList() {
  // Загрузка списка слайдов лекции пользователя
  update_slideList();
  slideName.innerHTML = get_slide(slideID, 0);
}

function add_frame() {
  // Добавление кадра для отмены
  if (undoList[0] != null) {
    undoList.length = undoID + 1;
  }
  let newFrame = [
    context.getImageData(0, 0, canvas.width, canvas.height),
    Date.now(),
  ];
  undoList = undoList.slice(0, undoID + 1);
  undoList.push(newFrame);
  undoID = undoList.length - 1;
  //context.drawImage(undoList[undoID][0], 0, 0,100,100);
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
      updateDebug();
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
  set_slide(slideID, 2, tmpFilePath);
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
  context.putImageData(undoList[undoID][0], 0, 0);
  updatePage();
}

function redo() {
  // Повтор действия
  if (undoID >= undoList.length - 1) return;
  undoID++;
  context.putImageData(undoList[undoID][0], 0, 0);
  updatePage();
}

function start_recording() {
  // Начало записи
  if (get_slide(slideID, 2) == "pictureURL") return;
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
  updateDebug();
}

function play_lection() {
  // Воспроизведение видео и пометок
  for (let i = 0; i < undoList.length - 1; i++) {
    alert(undoList[i][0]);
    alert(undoList[i][1]);
  }
}

function get_slide(num, num2) {
  // Получить данные слайда
  return slideList[num].split(", ")[num2];
}

function set_slide(num, num2, value) {
  // Задать данные слайда
  let slide = slideList[num].split(", ");
  slide[num2] = value;
  slideList[num] = "";
  for (i = 0; i < slide.length; i++) {
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
  var img = new Image();
  if (UrlExists(get_slide(num, 2))) {
    img.src = get_slide(num, 2);
    img.onload = () =>
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
  } else {
    context.clearRect(0, 0, canvas.width, canvas.height);
    recordButton.disabled = true;
  }
  if (UrlExists(get_slide(num, 1))) {
    video.src = get_slide(num, 1);
  } else {
    if (UrlExists(get_slide(slideID, 1))) {
      initVideo();
      video.controls = false;
    }
  }
  if (get_slide(num, 3) == "yes") playButton.style = "display: inline";
  else playButton.style = "display: none";
  slideID = num;
  slideName.innerHTML = get_slide(slideID, 0);
  update_slideList();
  updateDebug();
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
  slideName.innerHTML = get_slide(slideID, 0);
  updateDebug();
}

// Инициализация
login();
gen_slideList();
load_slideList();
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
