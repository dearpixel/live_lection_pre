// Кнопки
var gumVideo = document.getElementById("gum");
var record_button = document.getElementById("record");
var stop_button = document.getElementById("stop");
var play_button = document.getElementById("play");
var project_name = document.getElementById("project_name");
var rename_button = document.getElementById("rename_button");
var del_slide_button = document.getElementById("del_slide_button");
var new_slide_button = document.getElementById("new_slide_button");
var undo_button = document.getElementById("undo");

// Функции верхней полоски
// Поменять название проекта
function change_project_name() {
    project_name.innerHTML = 'Название проекта: ' + prompt('Введите новое название проекта');
}

// Переменные и константы
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
var lastX, lastY = 0;
var hue = 0;
var size = 4;
var color = '#000';
var undoList = [];
var scenario = {
    "frame": [],
    "time": []
}
var slideID = 0;
var audioChunks = [];

// При воспроизведении сравнивать время с первым действием

var isDrawing, isRecording, isRecorded, isPicture = false;

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

// Процесс рисования
/*canvas.addEventListener('mousemove', function (event) {
    draw(event);
});*/
canvas.addEventListener('mousemove', draw);

// Прекращение рисования
canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    newFrame = ctx.getImageData(0, 0, canvas.width, canvas.height)
    undoList.push(newFrame);
    scenario.time.push(Date.now());
    scenario.frame.push(newFrame);
});
canvas.addEventListener('mouseout', () => isDrawing = false);

// Отмена действия
function undo() {
    if (undoList.length > 0) {
        var oldLine = undoList.pop();
        ctx.putImageData(oldLine, 0, 0);
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
            //alert(file);
            img.onload = () => {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                undoList.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
            };
        };
        record_button.disabled = false;
        isPicture = true;
    }
});

// Запись видео
//var div = document.createElement('div');
//div.id = 'messages';
navigator.mediaDevices.getUserMedia({ audio: true, video: true })
    .then(stream => {
        gumVideo.srcObject = stream;
        const mediaRecorder = new MediaRecorder(stream);

        document.querySelector('#record').addEventListener('click', function () {
            if (isPicture) {
                stop_button.disabled = false;
                isRecording = record_button.disabled = play_button.disabled = true;
                scenario = null;
                mediaRecorder.start();
            }
        });
        mediaRecorder.addEventListener("dataavailable", function (event) {
            audioChunks.push(event.data);
        });

        document.querySelector('#stop').addEventListener('click', function () {
            stop_button.disabled = true;
            isRecording = record_button.disabled = play_button.disabled = false;
            isRecorded = true;
            mediaRecorder.stop();
            set_slide(slideID, 1, 'newURL');
        });

        mediaRecorder.addEventListener("stop", function () {
            const audioBlob = new Blob(audioChunks, {
                type: "video/webm"
            });

            var fd = new FormData();
            fd.append('voice', audioBlob);
            sendVoice(fd);
            audioChunks = [];
        });
    });

async function sendVoice(form) {
    var promise = await fetch(URL, {
        method: 'POST',
        body: form
    });
    if (promise.ok) {
        var response = await promise.json();
        console.log(response.data);
        audio.src = response.data;
        audio.controls = true;
        audio.autoplay = true;
        //document.querySelector('#messages').appendChild(audio);
    }
}

// Воспроизведение видео и пометок
function play() {

}

// Изменить название слайда
function chName(id) {
    slNames[id] = prompt("Введите название слайда");
    loadSlides();
}

function load_profile() {

}

var lection_list = {};

function load_lection_list() {

}

// 0 название слайда, 1 адрес видео, 2 адрес картинки, (3 адрес спенария пометок)
var slide_list = [
    "Пункт 1, url0, url1",
    "Пункт 2, url0, url1",
    "Пункт 3, url0, url1",
    "Пункт 4, url0, url1",
    "Пункт 5, url0, url1",
    "Пункт 6, url0, url1",
];

function get_slide(num, num2) {
    return slide_list[num].split(', ')[num2];
}

function set_slide(num, num2, value) {
    slide = slide_list[num].split(', ');
    slide[num2] = value;
    slide_list[num] = '';
    for (i = 0; i < slide.length; i++) {
        slide_list[num] += slide[i];
        if (i < slide.length-1)
            slide_list[num] += ', ';
    }
    update_slide_list();
}

// Убрать отображение доп. инфы когда будет настроена полная обработка этой инфы
function update_slide_list() {
    page_slides = document.getElementById("slide_list");
    page_slides.innerHTML = "";
    for (i = 0; i < slide_list.length; i++)
        if (i == slideID)
            page_slides.innerHTML += "<p class=line onclick=change_slide_name(" + i + ")><strong>" + slide_list[i] + "</strong>";
        else
            page_slides.innerHTML += "<p class=line onclick=change_slide(" + i + ")>" + slide_list[i];
}

function load_slide_list() {
    set_slide(0, 0, 'Слайд 1');
    update_slide_list();
}

function change_slide_name(num) {
    set_slide(num, 0, prompt("Введите новое название слайда"));
}

function change_slide(num) {
    slideID = num;
    document.getElementById("slideID").innerHTML = "Текущий слайд: " + slideID;
    update_slide_list();
}

function del_slide() {
    if (slide_list.length > 1) {
        slide_list.splice(slideID, 1);
        if (slideID == slide_list.length)
            slideID--;
        update_slide_list();
    } else alert("Остался всего один слайд!");
}
document.addEventListener("keydown", function (event) {
    //alert(event.code);
    if (event.code === "Delete") {
        del_slide();
    }
});

function new_slide() {
    slideID++;
    slide_list.splice(slideID, 0, prompt("Введите назание нового слайда") + ", url0, url1");
    update_slide_list();
}
document.addEventListener("keydown", function (event) {
    if (event.shiftKey && event.code === "KeyN") {
        new_slide();
    }
});

function login() {

}

function init() {
    login();
    load_slide_list();

    rename_button.onclick = change_project_name;
    play_button.onclick = play;
    del_slide_button.onclick = del_slide;
    new_slide_button.onclick = new_slide;
    undo_button.onclick = undo;
}

init();




// // Функции смены режима
// var mode_label = document.getElementById("mode");
// var mode1_button = document.getElementById("mode1");
// var mode2_button = document.getElementById("mode2");
// mode1_button.onclick = set_mode1;
// mode2_button.onclick = set_mode2;

// function set_mode1() {
//     mode_label.innerHTML = "Режим: просмотр"
// }

// function set_mode2() {
//     mode_label.innerHTML = "Режим: редактор"
// }