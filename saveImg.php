<?php
if (!$_SERVER['REQUEST_METHOD'] == 'POST' or !isset($_FILES['image'])) return;
$typeFile = explode('/', $_FILES['image']['type']);
$targetFile = 'lections/image/' . $_POST['filename'] . '.' . $typeFile[1];
move_uploaded_file($_FILES['image']['tmp_name'], $targetFile);