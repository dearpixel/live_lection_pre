<?php
if (!$_SERVER['REQUEST_METHOD'] == 'POST' or !isset($_FILES['voice'])) return;
$typeFile = explode('/', $_FILES['voice']['type']);
$targetFile = 'lections/video/' . $_POST['filename'] . '.' . $typeFile[1];
move_uploaded_file($_FILES['voice']['tmp_name'], $targetFile);
?>