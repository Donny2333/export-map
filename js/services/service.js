/**
 * Created by Donny on 17/3/22.
 */
(function (angular) {
    'use strict';

    angular.module('export-map.services', [])
        .factory('uuid', function () {
            var uuid = {};

            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }

            uuid.create = function () {
                return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                    s4() + '-' + s4() + s4() + s4();
            };

            return uuid;
        })

        .factory('Router', function () {
            var menus = [{
                id: 0,
                img: "images/grid.png",
                name: "我的地图",
                sref: 'app.explorer',
                sub: 'files'
            }, {
                id: 1,
                img: "images/plus.png",
                name: "资源仓库",
                sref: 'app.repository',
                sub: 'data'
            }, {
                id: 2,
                img: "images/video.png",
                name: "当前地图",
                sref: 'app.edit',
                sub: 'info'
            }];

            return {
                list: function () {
                    return menus;
                },

                get: function (id) {
                    return menus[id];
                },

                set: function (id, menu) {
                    menus[id] = menu;
                }
            }
        })

        .factory('Http', ["$q", "$http", function ($q, $http) {
            return {
                get: function (url) {
                    var deferred = $q.defer();

                    $http.get(url).then(function (res) {
                        deferred.resolve(res);
                    }, function (err) {
                        deferred.reject(err);
                    });

                    return deferred.promise;
                },
                post: function (url, param) {
                    var deferred = $q.defer();

                    $http.post(url, param).then(function (res) {
                        deferred.resolve(res);
                    }, function (err) {
                        deferred.reject(err);
                    });

                    return deferred.promise;
                }
            }
        }])

        .factory("Doc", ["Http", 'URL_CFG', function (Http, URL_CFG) {
            return {
                list: function (param) {
                    var url = URL_CFG.api + 'MapService.svc/GetMapDocList';
                    return Http.post(url, param);
                },
                getTypes: function (param) {
                    var url = URL_CFG.api + "MapService.svc/GetDocNames";
                    return Http.post(url, param);
                },
                create: function (param) {
                    var url = URL_CFG.api + 'MapService.svc/NewMapDoc';
                    return Http.post(url, param);
                },
                open: function (param) {
                    var url = '';
                    return Http.post(url, param);
                },
                remove: function (param) {
                    var url = '';
                    return Http.post(url, param);
                },
                close: function (param) {
                    var url = '';
                    return Http.post(url, param);
                },
                exportMap: function (param) {
                    var url = URL_CFG.api + 'MapService.svc/Export';
                    return Http.post(url, param);
                },
                addLayerToMap: function (param) {
                    var url = URL_CFG.api + 'MapService.svc/AddLayerToMap';
                    return Http.post(url, param);
                },
                getMapInfo: function (param) {
                    var url = URL_CFG.api + 'MapService.svc/GetMapInfo';
                    return Http.post(url, param);
                },
                removeLayerFromMap: function (param) {
                    var url = URL_CFG.api + 'MapService.svc/RemoveLayerFromMap';
                    return Http.post(url, param);
                }
            }
        }])

        .factory("Data", ["Http", 'URL_CFG', function (Http, URL_CFG) {
            return {
                getMapDataList: function (param) {
                    var url = URL_CFG.api + 'DataService.svc/GetMapDataList';
                    return Http.post(url, param);
                },
                getUserGdbInfo: function (param) {
                    var url = URL_CFG.api + 'DataService.svc/GetUserGdbInfo';
                    return Http.post(url, param);
                },
                importDataFromPublic: function (param) {
                    var url = URL_CFG.api + 'DataService.svc/ImportDataFromPublic';
                    return Http.post(url, param);
                }
            }
        }])

        .factory("Symbol", ["Http", 'URL_CFG', function (Http, URL_CFG) {
            return {
                getStyleList: function (param) {
                    var url = 'http://192.168.99.61:9527/MapSytleService.svc/GetStyleList';
                    return Http.post(url, param);
                },
                getPreview: function (param) {
                    var url = 'http://192.168.99.61:9527/MapSytleService.svc/GetSymbolPreview';
                    return Http.post(url, param);
                }
            }
        }])

})(angular);