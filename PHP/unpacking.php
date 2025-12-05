<?php
$sourcePath = __DIR__ .'/1.zip'; 
$targetFolder = __DIR__ .'/assets'; 
if (!is_dir($targetFolder)) {
    mkdir($targetFolder, 0777, true);
}
$fileName = basename($sourcePath);
$targetPath = $targetFolder . DIRECTORY_SEPARATOR . $fileName;
if (rename($sourcePath, $targetPath)) {
    echo "Файл успешно перемещён в $targetPath";
} else {
    echo "Ошибка при перемещении файла";
}
?>
