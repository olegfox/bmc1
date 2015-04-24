angular
    .module('audio', []).config(function ($interpolateProvider) {
        $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
    })
    .factory('AudioService', function () {
        "use strict";

        var params = {
            swf_path: '/sitemain/js/audio5js.swf',
            throw_errors: true,
            format_time: true
        };

        var audio5js = new Audio5js(params);

        return audio5js;
    })
    .controller('AudioController', function ($scope, $http, AudioService) {
        $http.get('/audio/json').
            then(function(response) {
//              Плейлисты
                $scope.audio = response.data;

//              Сервис для работы с аудио
                $scope.player = AudioService;

//              Текущий плейлист
                $scope.currentPlaylist = $scope.audio[0];

//              Определение мобильного устройства
                var isMobile = {
                    Android: function() {
                        return navigator.userAgent.match(/Android/i);
                    },
                    BlackBerry: function() {
                        return navigator.userAgent.match(/BlackBerry/i);
                    },
                    iOS: function() {
                        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
                    },
                    Opera: function() {
                        return navigator.userAgent.match(/Opera Mini/i);
                    },
                    Windows: function() {
                        return navigator.userAgent.match(/IEMobile/i);
                    },
                    any: function() {
                        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
                    }
                };

//              Перевод временной строки в секунды
                var timeToSeconds = function(time){
                    time = time.split(/:/);
                    return parseInt(time[0] * 60 + time[1]);
                }

//              Сброс проигрывания всех плейлистов
                var resetPlay = function(){
                    for(var a in $scope.audio){
                        $scope.audio[a].selected = 0;
                    }
                }

//              Флаг первичной загрузки
                var flagFirst = 0;

//              Загрузка трека
                var loadMusic = function(pl){
                    resetPlay();

                    if(pl != $scope.currentPlaylist){
                        flagFirst = 0;
                    }

                    if(pl.seeking == 0 || flagFirst == 0){
                        $scope.currentPlaylist = pl;
                        $('.audio .play-control').css('display', 'inline-block');
                        $scope.player.load(pl.audio[pl.numberTrack].file);
                        $scope.player.seek(pl.seeking);
                        flagFirst = 1;
                    }

                    pl.selected = 1;
                    $scope.player.play();

//                  Обновление времени проигрывания трека
                    $scope.player.on('timeupdate', function (position, duration) {
                        pl.seeking = timeToSeconds(position);
                    });

//                  Окончание проигрывания трека и переключение на следующий трек
                    $scope.player.on('ended', function () {
                        setTimeout(function(){
                            $scope.playNext();
                        }, 1000);
                    });
                }

//              Выбор радио
                $scope.changeRadio = function(){
                    if($('.audio .player .wrap_radio').css('display') == 'none'){
                        $('.audio .player .wrap_radio').css('display', 'inline-block');
                    }else{
                        $('.audio .player .wrap_radio').css('display', 'none');
                    }
                };

//              Нажатие на плейлист
                $scope.playMusic = function(playlist){
                    if(playlist.selected){
                        playlist.selected = 0;
                        $scope.player.pause();
                    }else{
                        loadMusic(playlist);
                    }
                };

//              Следующий трек в плейлисте
                $scope.playNext = function(){
                    $scope.currentPlaylist.seeking = 0;
                    $scope.currentPlaylist.numberTrack++;

//                  Если треки в плейлисте закончились начинаем играть с первого
                    if($scope.currentPlaylist.numberTrack >= $scope.currentPlaylist.countTracks){
                        $scope.currentPlaylist.numberTrack = 0;
                    }

                    loadMusic($scope.currentPlaylist);
                };

//              Предыдущий трек в плейлисте
                $scope.playPrev = function(){
                    $scope.currentPlaylist.seeking = 0;
                    $scope.currentPlaylist.numberTrack--;

//                  Если треки в плейлисте закончились начинаем играть с первого
                    if($scope.currentPlaylist.numberTrack < 0){
                        $scope.currentPlaylist.numberTrack = $scope.currentPlaylist.countTracks - 1;
                    }

                    loadMusic($scope.currentPlaylist);
                };
                if( !isMobile.iOS() ){
                    $scope.playMusic($scope.currentPlaylist);
                }
            });
    });