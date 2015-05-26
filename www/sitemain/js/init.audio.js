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
            then(function (response) {
//              Плейлисты
                $scope.audio = response.data;

//              Сервис для работы с аудио
                $scope.player = AudioService;

//              Флаг смены радиостанции
                $scope.click = 0;

//              Текущий плейлист
                $scope.currentPlaylist = $scope.audio[0];
                var date = new Date();
                var hour = date.getHours();

                if (hour >= 18) {
//                  препати саунд
                    $scope.currentPlaylist = $scope.audio[0];
                } else if (hour >= 0 && hour < 4) {
//                  найт саунд
                    $scope.currentPlaylist = $scope.audio[1];
                } else if (hour >= 4 && hour < 8) {
//                  морнинг саунд
                    $scope.currentPlaylist = $scope.audio[2];
                } else if (hour >= 8 && hour < 12) {
//                  с 9 до 12
                    $scope.currentPlaylist = $scope.audio[4];
                } else if (hour >= 12 && hour < 18) {
//                  дэй саунд
                    $scope.currentPlaylist = $scope.audio[3];
                }

//              Определение мобильного устройства
                var isMobile = {
                    Android: function () {
                        return navigator.userAgent.match(/Android/i);
                    },
                    BlackBerry: function () {
                        return navigator.userAgent.match(/BlackBerry/i);
                    },
                    iOS: function () {
                        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
                    },
                    Opera: function () {
                        return navigator.userAgent.match(/Opera Mini/i);
                    },
                    Windows: function () {
                        return navigator.userAgent.match(/IEMobile/i);
                    },
                    any: function () {
                        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
                    }
                };

//              Перевод временной строки в секунды
                var timeToSeconds = function (time) {
                    time = time.split(/:/);
                    return parseInt(time[0] * 60 + time[1]);
                }

//              Сброс проигрывания всех плейлистов
                var resetPlay = function () {
                    for (var a in $scope.audio) {
                        $scope.audio[a].selected = 0;
                    }
                }

//              Флаг первичной загрузки
                var flagFirst = 0;

//              Загрузка трека
                var loadMusic = function (pl, rand) {
                    resetPlay();

                    if (pl != $scope.currentPlaylist) {
                        flagFirst = 0;
                    }

                    if (pl.seeking == 0 || flagFirst == 0) {
                        $scope.currentPlaylist = pl;
                        $('.audio .play-control').css('display', 'inline-block');

                        if (rand) {
                            // Если поддерживается localStorage
                            if(window.localStorage!==undefined){
                                if(localStorage.getItem('random_count') === null){
                                    var array = [];

                                    for (var i = 0; i <= pl.countTracks - 1; i++) {
                                        array.push(i);
                                    }

                                    array.sort(function(a,b){ var c = Math.random()*array.length; return c<array.length/2} );

                                    localStorage.setItem('random_count', array.length - 1);
                                    localStorage.setItem('random_current', 0);

                                    for (var i = 0; i <= array.length - 1; i++) {
                                        localStorage.setItem('random_array'+i, array[i]);
                                    }

                                    pl.numberTrack = localStorage.getItem('random_array' + localStorage.getItem('random_current'));
                                }else{
                                    localStorage.setItem('random_current', parseInt(localStorage.getItem('random_current')) + 1);
                                    if(localStorage.getItem('random_current') > localStorage.getItem('random_count')){
                                        localStorage.setItem('random_current', 0);
                                        localStorage.removeItem('random_count');
                                    }
                                    pl.numberTrack = localStorage.getItem('random_array' + localStorage.getItem('random_current'));
                                }
                            }else{
                                pl.numberTrack = Math.floor(Math.random() * (pl.countTracks - 1));
                            }
                        }

                        console.log(pl.numberTrack);

                        $scope.player.load(pl.audio[pl.numberTrack].file);
                        $scope.player.seek(pl.seeking);
                        flagFirst = 1;
                    }

                    pl.selected = 1;
                    $scope.player.play();
                    $scope.$apply();

//                  Обновление времени проигрывания трека
                    $scope.player.on('timeupdate', function (position, duration) {
                        pl.seeking = timeToSeconds(position);

                        if ($scope.click == 0) {
                            var hour = date.getHours();

                            if (hour >= 18 && $scope.currentPlaylist != $scope.audio[0]) {
//                              препати саунд
                                $scope.currentPlaylist = $scope.audio[0];
                                $scope.playMusic($scope.currentPlaylist, 0, 0);
                            } else if (hour >= 0 && hour < 4 && $scope.currentPlaylist != $scope.audio[1]) {
//                              найт саунд
                                $scope.currentPlaylist = $scope.audio[1];
                                $scope.playMusic($scope.currentPlaylist, 0, 0);
                            } else if (hour >= 4 && hour < 8 && $scope.currentPlaylist != $scope.audio[2]) {
//                              морнинг саунд
                                $scope.currentPlaylist = $scope.audio[2];
                                $scope.playMusic($scope.currentPlaylist, 0, 0);
                            } else if (hour >= 8 && hour < 12 && $scope.currentPlaylist != $scope.audio[4]) {
//                              с 9 до 12
                                $scope.currentPlaylist = $scope.audio[4];
                                $scope.playMusic($scope.currentPlaylist, 0, 0);
                            } else if (hour >= 12 && hour < 18 && $scope.currentPlaylist != $scope.audio[3]) {
//                              дэй саунд
                                $scope.currentPlaylist = $scope.audio[3];
                                $scope.playMusic($scope.currentPlaylist, 0, 0);
                            }
                        }

                    });

//                  Окончание проигрывания трека и переключение на следующий трек
                    $scope.player.on('ended', function () {
                        setTimeout(function () {
                            $scope.playNext();
                        }, 1000);
                    });
                }

//              Выбор радио
                $scope.changeRadio = function () {
                    if ($('.audio .player .wrap_radio').css('display') == 'none') {
                        $('.audio .player .wrap_radio').css('display', 'inline-block');
                    } else {
                        $('.audio .player .wrap_radio').css('display', 'none');
                    }
                };

//              Нажатие на плейлист
                $scope.playMusic = function (playlist, click, rand) {
                    $scope.click = click;
                    if (playlist.selected) {
                        playlist.selected = 0;
                        $scope.player.pause();
                    } else {
                        loadMusic(playlist, rand);
                    }
                };

                $scope.playPause = function (){
                    if ($scope.currentPlaylist.selected) {
                        $scope.currentPlaylist.selected = 0;
                    }else{
                        $scope.currentPlaylist.selected = 1;
                    }
                    $scope.player.playPause()
                };

//              Следующий трек в плейлисте
                $scope.playNext = function () {
                    $scope.currentPlaylist.seeking = 0;
                    $scope.currentPlaylist.numberTrack++;

//                  Если треки в плейлисте закончились начинаем играть с первого
                    if ($scope.currentPlaylist.numberTrack >= $scope.currentPlaylist.countTracks) {
                        $scope.currentPlaylist.numberTrack = 0;
                    }

                    loadMusic($scope.currentPlaylist, 0);
                };

//              Предыдущий трек в плейлисте
                $scope.playPrev = function () {
                    $scope.currentPlaylist.seeking = 0;
                    $scope.currentPlaylist.numberTrack--;

//                  Если треки в плейлисте закончились начинаем играть с первого
                    if ($scope.currentPlaylist.numberTrack < 0) {
                        $scope.currentPlaylist.numberTrack = $scope.currentPlaylist.countTracks - 1;
                    }

                    loadMusic($scope.currentPlaylist, 0);
                };
                if (!isMobile.iOS()) {
                    $scope.playMusic($scope.currentPlaylist, 0, 1);
                }else{
                    loadMusic($scope.currentPlaylist, 1);
                    $scope.currentPlaylist.selected = 0;
                }
            });
    });

$(function () {
    setTimeout(function () {
        $('#9_12').parent().remove();
    }, 2000);

});