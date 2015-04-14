$(function () {
    var uploadEnd = 0,
        image = [],
        i = 0;
    $('.uploadify').parent().append("<input type='hidden' name='gallery' class='gallery' />");
    $('.uploadify').uploadify({
        'auto': false,
        'fileTypeDesc' : 'Image Files',
        'fileTypeExts' : '*.gif; *.jpg; *.png',
        'swf': '/sitemain/js/uploadify/uploadify.swf',
        'uploader': '/sitemain/js/uploadify/uploadify.php',
        'onQueueComplete': function (queueData) {
            uploadEnd = 1;
            $(".gallery").val(JSON.stringify(image));
            $("form").submit();
        },
        'onUploadError': function (file, errorCode, errorMsg, errorString) {
            alert('Файл ' + file.name + ' не может быть загружен: ' + errorString);
        },
        'onUploadSuccess': function (file, data, response) {
            image[i] = data;
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