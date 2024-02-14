<!DOCTYPE html>
<html lang='ru'>
<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL);
?>

<head>
  <meta charset='utf-8' />
  <link rel='stylesheet' href='style.css' type='text/css'>
  <link rel='icon' type='image/x-icon' href='/resources/images/favicon.ico'>
  <title>Мультимедиа лекции</title>
</head>

<body>
  <!--Основной контент-->
  <table class="content">

    <!--Переключение слайдов-->
    <tr>
      <td colspan="2">
        <div class='dropdown'>
          <h3 id='projectOwner'>Аркадий Фёдорович</h3>
          <div class='dropdown-content'>
            <button id='newLectionButton' name='Создать слайд'>Создать лекцию</button>
            <button id='exitProfileButton' name='Выход из профиля'>Выход</button>
          </div>
        </div>
        <hr>
      </td>
    </tr>
    <tr>
      <td>
        <div class='dropdown'>
          <h3 id='projectName'>Название проекта: Биология 3-й класс</h3>
          <div class='dropdown-content'>
            <table>
              <tr>
                <td>
                  <div id='lectionList' style='width: 500px; height:410px; overflow: auto; border: 1px solid gray; border-radius: 4px; background-color: #ddd'>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <button id='saveLectionButton' name='Сохранить лекцию'>Сохранить лекцию</button>
                  <button id='delLectionButton' name='Удалить слайд'>Удалить</button>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </td>
      <td>
        <div class='dropdown'>
          <h3 id='slideName'>Название слайда</h3>
          <div class='dropdown-content'>
            <table>
              <tr>
                <td>
                  <div id='slideList' style='width: 500px; height:410px; overflow: auto; border: 1px solid gray; border-radius: 4px; background-color: #ddd'>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <button id='newSlideButton' name='Создать слайд'>Создать слайд</button>
                  <button id='delSlideButton' name='Удалить слайд'>Удалить</button>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </td>
    </tr>

    <!--Запись и пометки-->
    <tr>
      <td>
        <div class='rec_circle' style='display: none'></div>
        <video width=600 height=450 id='video' autoplay muted></video>
      </td>
      <td>
        <canvas willReadFrequently=true id='canvas' width=600 height=450></canvas>
      </td>
    </tr>

    <!--Управление-->
    <tr>
      <td>
        <center>
          <div class='dropdown'>
            <h3 style='width: 30px;'>
              <center>?</center>
            </h3>
            <div class='dropdown-content' style='width: 120px'>
              <h3>
                <center>Перед записью видео необходимо добавить слайд-картинку</center>
              </h3>
            </div>
          </div>
          <button id='start_recording' name='Начало записи' disabled>Запись</button>
          <button id='stop_recording' name='Остановка записи' disabled>Стоп</button>
          <button id='play_button' name='Воспроизвести' style='display: none'>Воспроизвести</button>
        </center>
      </td>
      <td>
        <table>
          <tr>
            <td>
              <form method='POST' enctype='multipart/form-data' style='float: left'>
                <button id='file-upload-button'>Выбрать картинку</button>
                <input type='file' name='image' id='image' accept='image/*' style='display: none' />
                <input id='sendPicture' style='display: none' type='submit' value='Upload' />
              </form>
            </td>
            <td>
              <button id='undo' name='назад'>
                <image id='undoImg' alt='Назад' src='/resources/images/undoOff.png' width=14 height=14></image>
              </button>
              <button id='redo'>
                <image id='redoImg' alt='Вперёд' src='/resources/images/redoOff.png' width=14 height=14></image>
              </button>
            </td>
            <td>
              <input type='range' name='Размер кисти' id='size' min='1' max='40' value='3'>
              <input type='color' name='Цвет кисти' id='color' value='#000000'>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  <h3 id='debug'></h3>
  <script src='script.js'></script>
</body>

</html>