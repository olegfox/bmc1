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
                $scope.player1;
                $scope.player2;

//              Текущий плейлист
                $scope.currentPlaylist = $scope.audio[0];

                var date = new Date();
                var hour = date.getHours();

                if(hour >= 18){
                    $scope.currentPlaylist = $scope.audio[0];
                }else if(hour >= 0 && hour < 4){
                    $scope.currentPlaylist = $scope.audio[3];
                }else if(hour >= 4 && hour < 8){
                    $scope.currentPlaylist = $scope.audio[6];
                }else if(hour >= 8 && hour < 12){
                    $scope.currentPlaylist = $scope.audio[0];
                }else if(hour >= 12 && hour < 18){
                    $scope.currentPlaylist = $scope.audio[4];
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
                    return parseInt(time[0]) * 60 + parseInt(time[1]);
                }

//              Сброс проигрывания всех плейлистов
                var resetPlay = function () {
                    for (var a in $scope.audio) {
                        $scope.audio[a].selected = 0;
                    }
                }

//              Флаг первичной загрузки
                var flagFirst = 0;

//              Флаг потока
                var flagStream = 0;

//              Обновление времени
                var timeUpdate = function (pl, position, duration) {
                    var diff; // Оставшееся время

                    pl.seeking = timeToSeconds(position);
                    diff = duration - pl.seeking;
                    console.log('duretion = ' + duration);
                    console.log('position = ' + position);
                    console.log('position = ' + pl.seeking);

//                      Если осталось меньше 15 секунд
                    if (diff <= 15) {
//                          То начинаем уменьшать громкость
                        if (Math.floor(diff) > 1) {
                            $scope.player.volume($scope.player.volume() - $scope.player.volume() / 50);
                            console.log($scope.player.volume() - $scope.player.volume() / 50);
                            console.log(diff);
                        }

//                      Если осталось 10 секунд, то начинаем следующий трек
                        if (Math.floor(diff) == 10 && flagStream == 0) {

                            flagStream = 1;
                            $scope.currentPlaylist.seeking = 0;
                            $scope.currentPlaylist.numberTrack++;

//                              Если треки в плейлисте закончились начинаем играть с первого
                            if ($scope.currentPlaylist.numberTrack >= $scope.currentPlaylist.countTracks) {
                                $scope.currentPlaylist.numberTrack = 0;
                            }

                            if ($scope.player === $scope.player2) {
                                $scope.player1 = new Audio5js({
                                    swf_path: '/sitemain/js/audio5js.swf',
                                    throw_errors: true,
                                    format_time: true
                                });

                                $scope.player1.load(pl.audio[pl.numberTrack].file);
                                $scope.player1.volume(0);
                                $scope.player1.seek(0);
                                $scope.player1.play();
                            } else {
                                $scope.player2 = new Audio5js({
                                    swf_path: '/sitemain/js/audio5js.swf',
                                    throw_errors: true,
                                    format_time: true
                                });
                                $scope.player2.load(pl.audio[pl.numberTrack].file);
                                $scope.player2.volume(0);
                                $scope.player2.seek(0);

                                $scope.player2.play();
                                console.log(pl.numberTrack);
                            }

//                          Если осталось меньше 10 секунд
                        } else if (Math.floor(diff) < 10) {
//                          Если осталась одна секунда, то оставляем один поток
                            if (Math.floor(diff) == 1 && flagStream == 1) {

                                $scope.player.pause();
                                $scope.player.destroy();
                                setTimeout(function () {

                                    if ($scope.player === $scope.player2) {
                                        delete $scope.player;
                                        delete $scope.player2;
                                        $scope.player = $scope.player1;
                                    } else {
                                        delete $scope.player;
                                        delete $scope.player1;
                                        $scope.player = $scope.player2;
                                    }
//                                    $scope.player = angular.copy($scope.player2);
                                    $scope.$apply();
                                    $scope.player.volume(1);

//                                $scope.player2.destroy();

//                              Обновление времени проигрывания трека
                                    $scope.player.on('timeupdate', function (position, duration) {
                                        console.log('update2');
                                        console.log('volume = ' + $scope.player.volume());
                                        timeUpdate(pl, position, duration);
                                    });
                                }, 1000);

                                flagStream = 0;

                                flagFirst = 1;
                            } else {
                                if (Math.floor(diff) > 1) {
                                    if ($scope.player === $scope.player2) {
                                        $scope.player1.volume($scope.player1.volume() + 0.02);
                                    } else {
                                        $scope.player2.volume($scope.player2.volume() + 0.02);
                                    }
                                }
                            }
                        }
                    }
                };

//              Окончание трека
                var ended = function(){
                    console.log('ended');
                    setTimeout(function(){
                        $scope.playNext();
                    }, 1000);
                };

//              Загрузка трека
                var loadMusic = function (pl) {
                    resetPlay();

                    if (pl != $scope.currentPlaylist) {
                        flagFirst = 0;
                    }
                    if (pl.seeking == 0 || flagFirst == 0) {
                        $scope.currentPlaylist = pl;
                        $('.audio .play-control').css('display', 'inline-block');
                        console.log('load');
                        $scope.player.load(pl.audio[pl.numberTrack].file);
                        $scope.player.seek(pl.seeking);
                        flagFirst = 1;
                    }

                    if($scope.player2 instanceof Object && $scope.player2 !== $scope.player){
                        $scope.player2.pause();
                        delete $scope.player2;
                    }
                    if($scope.player1 instanceof Object && $scope.player1 !== $scope.player){
                        $scope.player1.pause();
                        delete $scope.player1;
                    }

                    pl.selected = 1;
                    console.log('play');
                    $scope.player.volume(1);
                    setTimeout(function(){
                        $scope.player.play();
                    }, 1000);
                    $scope.$apply();

//                    if(isMobile.iOS() || isMobile.Android()){
//                        $scope.player.on('ended', function () {
//                            ended();
//                        });
//                    }else{
//                      Обновление времени проигрывания трека
                        $scope.player.on('timeupdate', function (position, duration) {
                            timeUpdate(pl, position, duration);
                        });
//                    }

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
                $scope.playMusic = function (playlist) {
                    if (playlist.selected) {
                        console.log('pause');
                        playlist.selected = 0;
                        $scope.player.pause();
                        if($scope.player1 instanceof Object){
                            $scope.player1.pause();
                            delete $scope.player1;
                        }
                        if($scope.player2 instanceof Object){
                            $scope.player2.pause();
                            delete $scope.player2;
                        }
                    } else {
                        if($scope.player1 instanceof Object){
                            $scope.player1.play();
                        }
                        if($scope.player2 instanceof Object){
                            $scope.player2.play();
                        }
                        loadMusic(playlist);
                    }
                };

//              Следующий трек в плейлисте
                $scope.playNext = function () {
                    $scope.currentPlaylist.seeking = 0;
                    $scope.currentPlaylist.numberTrack++;

//                  Если треки в плейлисте закончились начинаем играть с первого
                    if ($scope.currentPlaylist.numberTrack >= $scope.currentPlaylist.countTracks) {
                        $scope.currentPlaylist.numberTrack = 0;
                    }

                    loadMusic($scope.currentPlaylist);
                };

//              Предыдущий трек в плейлисте
                $scope.playPrev = function () {
                    $scope.currentPlaylist.seeking = 0;
                    $scope.currentPlaylist.numberTrack--;

//                  Если треки в плейлисте закончились начинаем играть с первого
                    if ($scope.currentPlaylist.numberTrack < 0) {
                        $scope.currentPlaylist.numberTrack = $scope.currentPlaylist.countTracks - 1;
                    }

                    loadMusic($scope.currentPlaylist);
                };
                if (!isMobile.iOS()) {
                    if(hour >= 8 && hour < 12){

                    }else{
                        $scope.playMusic($scope.currentPlaylist);
                    }
                }
            });
    });