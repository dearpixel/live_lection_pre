<!DOCTYPE html>
<!--Данная страница выполняет только функции записи лекций-->
<html lang="ru">

<head>
  <meta charset="utf-8" />
  <link rel="stylesheet" href="style.css" type="text/css">
  <link rel="icon" type="image/x-icon" href="/images/favicon.ico">
  <title>Мультимедиа лекции</title>
</head>

<body>
  <!--Верхняя полоска-->
  <table style="
  max-width: 80%;
  margin: auto;">
    <tr>
      <td>
        <div class="dropdown">
          <h3 style="width: 30px;"><center>?</center></h3>
          <div class="dropdown-content">
            <h3><center>Перед записью видео необходимо добавить слайд-картинку</center></h3>
          </div>
        </div>
      </td>
      <td>
        <div style="width: 100px;"> </div>
      </td>
      <td>
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
        <div style="width:100px"> </div>
      </td>
      <td>
        <h3 id="slideID">Текущий слайд: 0</h3>
      </td>
      <!--<td style="float:right">
        <div class="dropdown">
          <h3 id="mode">Режим: редактор</h3>
          <div class="dropdown-content">
            <h3 id="mode1">Режим: просмотр</h3>
            <h3 id="mode2">Режим: редактор</h3>
          </div>
        </div>
      </td>-->
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
              <div id="slide_list" style="width: 200px; height:300px; overflow: auto;">
                <!--Список слайдов-->
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <center>
                <button id="new_slide_button">Создать слайд</button>
                <button id="del_slide_button">Удалить</button>
              </center>
            </td>
          </tr>
        </table>
      </td>
      <td>
        <table>
          <tr>
            <td>
              <video width="400" height="300" id="gum" autoplay muted></video>
            </td>
          </tr>
          <tr>
            <td>
              <center>
                <div class="dropdown">
                  <h3 style="width: 30px;"><center>?</center></h3>
                  <div class="dropdown-content" style="width: 120px">
                    <h3><center>Перед записью видео необходимо добавить слайд-картинку</center></h3>
                  </div>
                </div>
                <button id="record" disabled>Запись</button>
                <button id="stop" disabled>Стоп</button>
                <button id="play" disabled>Просмотр</button>
              </center>
            </td>
          </tr>
        </table>
      </td>
      <td>
        <center>
          <canvas id="canvas" width="550" height="300"></canvas>
          <button id="undo" class="empty"><image src="/images/prev.png"></image></button>
          <button id="next" class="empty"><image src="/images/next.png"></image></button>
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