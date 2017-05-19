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
                name: "地图编辑",
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

        .factory('Auth', ['Http', function (Http) {
            var _user = {
                userId: 1,
                name: '姚志武'
            };
            return {
                login: function () {

                },
                logout: function () {

                },
                getUserInfo: function () {
                    return _user;
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
                    var url = URL_CFG.api + 'MapService.svc/DeleteMapDoc';
                    return Http.post(url, param);
                },
                save: function (param) {
                    var url = URL_CFG.api + 'MapService.svc/SaveMapDoc';
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
                },
                publish: function (param) {
                    var url = URL_CFG.api + 'MapService.svc/PublishDoc';
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
                    var url = URL_CFG.api + 'MapSytleService.svc/GetStyleList';
                    return Http.post(url, param);
                },
                getSymbolItemListFromDB: function (param) {
                    var url = URL_CFG.api + 'MapSytleService.svc/GetSymbolItemListFromDB';
                    return Http.post(url, param);
                },
                getSymbolPreview: function (param) {
                    var url = URL_CFG.api + 'MapSytleService.svc/GetSymbolPreview';
                    return Http.post(url, param);
                },
                GetLayerSymbolInfo: function (param) {
                    var url = URL_CFG.api + 'MapService.svc/GetLayerSymbolInfo';
                    return Http.post(url, param);
                },
                RemoveLayerFromMap: function (param) {
                    var url = URL_CFG.api + 'MapService.svc/RemoveLayerFromMap';
                    return Http.post(url, param);
                }
            }
        }])

        .factory("AletDiag", ["$http", "$q", "$cookieStore", "$location", "$modal",
            function ($http, $q, $cookieStore, $location, $modal) {
                return {
                    openConfirmWindow: function (modalTitle, modalContent, modalInstance) {
                        console.log("122");
                        var deferred = $q.defer();
                        /*
                         * modalInstance是在弹窗的基础上再弹出confirm确认框时从第一个弹窗中传进的$modalInstance,
                         * 若是直接在页面上弹出confirm确认框，则不能传$modalInstance,否则会报错
                         */
                        var confirmModal = $modal.open({
                            backdrop: 'static',
                            templateUrl: 'template/modal/confirmModelTemplate.html',  // 指向确认框模板
                            controller: 'ConfirmCtrl',// 初始化模态控制器
                            windowClass: "confirmModal",// 自定义modal上级div的class
                            size: 'sm', //大小配置
                            resolve: {
                                data: function () {
                                    return {modalTitle: modalTitle, modalContent: modalContent};//surgeonSug: $scope.surgeonSug,
                                }
                            }
                        });
                        // 处理modal关闭后返回的数据
                        confirmModal.result.then(function () {
                            if (!!modalInstance) {
                                modalInstance.dismiss('cancel');
                            }
                            deferred.resolve();
                        }, function () {
                        });
                        return deferred.promise;
                    }
                }
            }])

})(angular);