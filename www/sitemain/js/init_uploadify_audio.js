$(function () {
    var uploadEnd = 0,
        audio = [],
        i = 0;
    $('.uploadify').parent().append("<input type='hidden' name='audio' class='gallery' />");
    $('.uploadify').uploadify({
        'auto': false,
        'fileTypeDesc' : 'Audio Files',
        'fileTypeExts' : '*.mp3',
        'swf': '/sitemain/js/uploadify/uploadify.swf',
        'uploader': '/sitemain/js/uploadify/uploadify_audio.php',
        'onQueueComplete': function (queueData) {
            uploadEnd = 1;
            $(".gallery").val(JSON.stringify(audio));
            $("form").submit();
        },
        'onUploadError': function (file, errorCode, errorMsg, errorString) {
            alert('Файл ' + file.name + ' не может быть загружен: ' + errorString);
        },
        'onUploadSuccess': function (file, data, response) {
            audio[i] = JSON.parse(data);
            i++;
        }
    });
    $("form").submit(function () {
        if (uploadEnd == 0 && $(".uploadify-queue *").length > 0) {
            $('.uploadify').uploadify('upload', '*');
            return false;
        }
    });
});