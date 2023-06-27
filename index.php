<!DOCTYPE html>

<html lang="ru">

<head>
  <meta charset="utf-8" />
  <link rel="stylesheet" href="style.css" type="text/css">
  <title>Мультимедиа лекции</title>
</head>

<body>
  <!--Верхняя полоска-->
  <table style="
  max-width: 80%;
  margin: auto;">
    <tr>
      <td style="float:left">
        <div class="dropdown">
          <h3 id="project_name">Название проекта: пустой проект</h3>
          <div class="dropdown-content">
            <h3 id="rename_button">Переименовать</h3>
            <h3 id="load_project">Загрузить</h3>
            <h3 id="save_project">Сохранить</h3>
            <h3 id="del_project">Удалить</h3>
          </div>
        </div>
      </td>
      <td>
        <div style="width:60px"></div>
      </td>
      <td style="float:left">
        <h3 id="slideID">Текущий слайд: 1</h3>
      </td>
      <td>
        <div style="width:60px"> </div>
      </td>
      <td style="float:right">
        <div class="dropdown">
          <h3 id="mode">Режим: просмотр</h3>
          <div class="dropdown-content">
            <h3 id="mode1">Режим: просмотр</h3>
            <h3 id="mode2">Режим: редактор</h3>
          </div>
        </div>
      </td>
    </tr>
  </table>
  <!--Основной контент-->
  <table style="
  border-radius: 4px;
  background-color: #ddd;
  box-shadow: 1px 1px 2px 2px rgba(0,0,0,1);">
    <!--Названия разделов-->
    <tr>
      <td>
        <p style="text-align: center">Список слайдов</p>
      </td>
      <td>
        <p style="text-align: center">Видео</p>
      </td>
      <td>
        <p style="text-align: center">Слайд</p>
      </td>
    </tr>
    <!--Контент разделов-->
    <tr>
      <td id="slideList">
        <table>
          <tr>
            <td style="border: 1px solid gray; border-radius: 4px; background-color: #ddd">
              <div style="width: 200px; height:300px; overflow: auto;">
                <p>Тригонометрические уравнения 1
                <p>Тригонометрические уравнения 2
                <p>Тригонометрические уравнения 3
                <p>Тригонометрические уравнения 4
                <p>Тригонометрические уравнения 5
                <p>Тригонометрические уравнения 6
                <p>Тригонометрические уравнения 7
                <p>Тригонометрические уравнения 8
                <p>Тригонометрические уравнения 9
                <p>Тригонометрические уравнения 10
                <p>Тригонометрические уравнения 11
                <p>Тригонометрические уравнения 12
                <p>Тригонометрические уравнения 13
                <p>Тригонометрические уравнения 14
                <p>Тригонометрические уравнения 15
                <p>Тригонометрические уравнения 16
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <center>
                <button>Создать слайд</button>
                <button>Удалить</button>
              </center>
            </td>
          </tr>
        </table>
      </td>
      <td>
        <table>
          <tr>
            <td>
              <video width="400" height="30" id="gum" autoplay muted></video>
            </td>
          </tr>
          <tr>
            <td>
              <center>
                <button id="record">Запись</button>
                <button id="stop">Стоп</button>
                <button id="play" disabled>Просмотр</button>
              </center>
            </td>
          </tr>
        </table>
      </td>
      <td>
        <center>
          <canvas id="canvas" width="550" height="300"></canvas>
          <button onclick="undo()">Отменить</button>
          <input type="range" id="size" min="1" max="40" value="4">
          <input type="color" id="color" value="#000000">
          <input type="file" id="image" accept="image/*">
        </center>
      </td>
    </tr>
  </table>
  <script src="script.js"></script>
</body>

</html>