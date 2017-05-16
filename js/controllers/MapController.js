/**
 * Created by Donny on 17/5/16.
 */
(function (angular) {
    'use strict';

    angular.module('export-map.controllers')
        .controller('MapController', ['$scope', 'Router', 'Doc', 'Data', 'URL_CFG', function ($scope, Router, Doc, Data, URL_CFG) {
            var vm = $scope.vm = {
                menus: Router.list()
            };

            finishCreateMap();

            var extent = [12349186.0111133, 3765310.49379061, 12541939.221565, 3874205.11961953];
            var map = new ol.Map({
                controls: ol.control.defaults().extend([
                    new ol.control.ScaleLine()
                ]),
                layers: [
                    new ol.layer.Image()
                ],
                target: 'map',
                view: new ol.View({
                    center: [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2],
                    // zoom: 15,
                    extent: extent,
                    resolution: 96,
                    projection: 'EPSG:3857'
                })
            });

            function initMap(url) {
                map.getLayers().item(0).setSource(new ol.source.ImageWMS({
                    url: url,
                    attributions: '© <a href="http://www.dx-tech.com/">HGT</a>',
                    imageExtent: map.getView().calculateExtent(),
                    params: {
                        docId: vm.doc.docId,
                        userId: vm.doc.userId,
                        name: vm.doc.name
                    }
                }));
            }

            function getMapInfo() {
                Doc.getMapInfo({
                    docId: vm.doc.docId,
                    userId: vm.doc.userId,
                    name: vm.doc.name
                }).then(function (res) {
                    if (res.data.status === "ok" && res.data.result) {
                        vm.layers = res.data.result.layers;
                        console.log(res.data.result.layers);
                    }
                });
            }

            function finishCreateMap() {
                vm.mask = false;
                vm.doc = {
                    docId: 44,
                    userId: 1,
                    name: '老河口测试地图',
                    name2: '来自前端的老河口测试地图',
                    author: '姚志武',
                    detail: '老河口测试地图，老河口测试地图',
                    detail2: '老河口测试地图，老河口测试地图，老河口测试地图',
                    tagName: '城管'
                };
                Data.getUserGdbInfo({
                    userId: vm.doc.userId
                }).then(function (res) {
                    if (res.status === 200) {
                        vm.gdbs = [];
                        res.data.result.map(function (gdb) {
                            vm.gdbs.push({
                                name: gdb.Name,
                                gdbPath: gdb.GdbPath
                            });
                        });
                        console.log(vm.gdbs[0]);
                    } else {
                        // Todo: 创建用户的gdb
                    }
                });
                // initMap(URL_CFG.api + 'MapService.svc/Export');
                // getMapInfo();
            }
        }])
})(angular);