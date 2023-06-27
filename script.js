// Функции верхней полоски
var project_name = document.getElementById("project_name");
var rename_button = document.getElementById("rename_button");
rename_button.onclick = change_project_name;
// Поменять название проекта
function change_project_name() {
    project_name.innerHTML = 'Название проекта: ' + prompt('Введите новое название проекта');
}

// Функции смены режима
var mode_label = document.getElementById("mode");
var mode1_button = document.getElementById("mode1");
var mode2_button = document.getElementById("mode2");
mode1_button.onclick = set_mode1;
mode2_button.onclick = set_mode2;

function set_mode1() {
    mode_label.innerHTML = "Режим: просмотр"
}

function set_mode2() {
    mode_label.innerHTML = "Режим: редактор"
}

// Запись действий
let position = {};
/*
    x: mouseX,
    y: mouseY,
    timestamp: timestamp
};*/

// Функции рисования
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let hue = 0;
let size = 4;
let color = '#000';
let undoList = [];

let scenario = {
    "frame": [],
    "time": []
}

// При воспроизведении сравнивать время с первым действием

var isRecording = false;
var isRecorded = false;
function draw(e) {
    if (!isDrawing) return;
    if (!isRecording) return;
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

// Начало рисования
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
});

// Процесс рисования - вроде проблема тут
canvas.addEventListener('mousemove', function (event) {
    draw(event);
    //position.push(event.clientX, event.clientY, Date.now());
});
canvas.addEventListener('mousemove', draw);

// Прекращение рисования
canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    undoList.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    scenario.time.push(Date.now());
    scenario.frame.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
});
canvas.addEventListener('mouseout', () => isDrawing = false);

// Отмена действия
function undo() {
    if (undoList.length > 0) {
        ctx.putImageData(undoList.pop(), 0, 0);
    }
    scenario.time.push(Date.now());
    scenario.frame.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
}

// Изменение размера кисти
document.getElementById('size').addEventListener('input', (e) => {
    size = e.target.value;
});

// Изменение цвета кисти
document.getElementById('color').addEventListener('input', (e) => {
    color = e.target.value;
});

// Изменение рисунка
document.getElementById('image').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const img = new Image();
            img.src = reader.result;
            img.onload = () => {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                undoList.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
            };
        };
    }
});

// Функции видеозаписи
// Привязать функционал
slideID = 1;
var mediaRecorder;
var recordedBlobs;
var gumVideo = document.getElementById("gum");
var record_button = document.getElementById("record");
var stop_button = document.getElementById("stop");
var play_button = document.getElementById("play");
record_button.onclick = startRecording;
stop_button.onclick = stopRecording;
play_button.onclick = play;

// Воспроизведение видео и пометок
function play() {

}

// Показать изображение с камеры
navigator.mediaDevices
    .getUserMedia({ audio: true, video: true })
    .then((stream) => {
        window.stream = stream;
        gumVideo.srcObject = stream;
    })
    .catch((error) => {
        console.log("navigator.getUserMedia error: ", error);
    });

// Запрос видеопотока
function handleDataAvailable(event) {
    if (event.data && event.data.size > 0) {
        recordedBlobs.push(event.data);
    }
}

// Запись видео
function startRecording() {
    isRecording = record_button.disabled = play_button.disabled = true;
    scenario = null;
    recordedBlobs = [];
    try {
        mediaRecorder = new MediaRecorder(window.stream);
    } catch (e) {
        console.error("Exception while creating MediaRecorder: " + e);
        return;
    }
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start(10);
}

// Остановка записи и сохранение
function stopRecording() {
    isRecording = record_button.disabled = false;
    isRecorded = true;
    play_button.disabled = false;
    mediaRecorder.stop();
    var blob = new Blob(recordedBlobs, { type: "video/webm" });
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "Слайд" + slideID + ".webm"; //document.URL.replace('index.html','media/Слайд'+slideID+'.webm');
    //a.download = a.download.replace('file:///','')
    //a.download = 'folder/file.txt'
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 100);
}

// Изменить название слайда
function chName(id) {
    slNames[id] = prompt("Введите название слайда");
    loadSlides();
}

// Загрузка слайдов (сделать это в одном месте с загрузкой проекта)
loadSlides();
function loadSlides() {/*
    SlideCount = 4; //prompt("Введите количество слайдов: ")
    if (!(slNames instanceof Array)) {
      slNames = [];
      for (i = -1; i++ < SlideCount;) slNames.push("Слайд" + i + ".jpg");
    }
    toInsert = "";
    for (i = 0; i++ < SlideCount;) {
      if (i == slideID)
        toInsert +=
          "<a style='background:#aaa' onclick=chName(" +
          i +
          ")>" +
          slNames[i] +
          "</a><br>";
      else
        toInsert += "<a onclick=chName(" + i + ")>" + slNames[i] + "</a><br>";
    }
    document.getElementById("slideList").innerHTML = toInsert;*/
}

/*
function setImg(id) {
    if (slideID != id) {
        slideID = id;
        document.getElementById("slideID").innerHTML =
            "Текущий слайд: " + slideID;
        document.getElementById("img").src = "media/Слайд" + id + ".jpg";
        if (slideID == 1) {
            document.getElementById("next").disabled = false;
            document.getElementById("prev").disabled = true;
        } else if (slideID == SlideCount) {
            document.getElementById("next").disabled = true;
            document.getElementById("prev").disabled = false;
        } else {
            document.getElementById("next").disabled = false;
            document.getElementById("prev").disabled = false;
        }
    }
    loadSlides();
}
*/

/*
function goNext() {
  if (slideID < SlideCount) {
    slideID++;
    document.getElementById("prev").disabled = false;
    document.getElementById("slideID").innerHTML =
      "Текущий слайд: " + slideID;
    document.getElementById("img").src = "media/Слайд" + slideID + ".jpg";
  }
  if (slideID == SlideCount) document.getElementById("next").disabled = true;
  loadSlides();
}*/

function load_profile() {

}

let lection_list = {};

function load_lection_list() {

}

let slide_list = {};

function load_slide_list() {

}

// Добавить стили для наведения на пункты, а также js для реакции на клик
function update_slide_list() {

}

function login() {

}

function init() {
    login();
    load_slide_list();
    update_slide_list();
}

init();

const URL = 'voice.php';
let div = document.createElement('div');
div.id = 'messages';
let start = document.createElement('button');
start.id = 'start';
start.innerHTML = 'Start';
let stop_ = document.createElement('button');
stop_.id = 'stop';
stop_.innerHTML = 'Stop';
document.body.appendChild(div);
document.body.appendChild(start);
document.body.appendChild(stop_);
navigator.mediaDevices.getUserMedia({ audio: true, video: true })
    .then(stream => {
        const mediaRecorder = new MediaRecorder(stream);

        document.querySelector('#start').addEventListener('click', function () {
            mediaRecorder.start();
        });
        let audioChunks = [];
        mediaRecorder.addEventListener("dataavailable", function (event) {
            audioChunks.push(event.data);
        });

        document.querySelector('#stop').addEventListener('click', function () {
            mediaRecorder.stop();
        });

        mediaRecorder.addEventListener("stop", function () {
            const audioBlob = new Blob(audioChunks, {
                type: "video/webm"
            });

            let fd = new FormData();
            fd.append('voice', audioBlob);
            sendVoice(fd);
            audioChunks = [];
        });
    });

async function sendVoice(form) {
    let promise = await fetch(URL, {
        method: 'POST',
        body: form
    });
    if (promise.ok) {
        let response = await promise.json();
        console.log(response.data);
        audio.src = response.data;
        audio.controls = true;
        audio.autoplay = true;
        document.querySelector('#messages').appendChild(audio);
    }
}