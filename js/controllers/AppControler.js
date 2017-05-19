/**
 * Created by Donny on 17/3/22.
 */
(function (angular) {
    'use strict';

    angular.module('export-map.controllers', [])
        .controller('AppController', ['$scope', '$rootScope', '$state', 'Router', 'Doc', 'Data', 'URL_CFG', function ($scope, $rootScope, $state, Router, Doc, Data, URL_CFG) {
            var vm = $scope.vm = {
                menus: Router.list()
            };

            var extent = [12349186.0111133, 3765310.49379061, 12541939.221565, 3874205.11961953];
            var map = null;
            // var map = new ol.Map({
            //     controls: ol.control.defaults().extend([
            //         new ol.control.ScaleLine()
            //     ]),
            //     layers: [new ol.layer.Image()],
            //     target: 'map',
            //     view: new ol.View({
            //         center: [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2],
            //         // zoom: 15,
            //         extent: extent,
            //         resolution: 96,
            //         projection: 'EPSG:3857'
            //     })
            // });

            $scope.go = function ($event, menu) {
                $event.preventDefault();
                $state.go([menu.sref, menu.sub].join('.'));
            };

            $scope.createOrClose = function () {
                if (vm.doc && vm.doc.docId) {
                    // 关闭文档
                    vm.doc = {};
                    map.removeLayer(map.getLayers().item(0));
                } else {
                    // 新建文档
                    Doc.list({
                        // userId: 1,
                        pageNo: 0,
                        pageNum: 8,
                        tagName: "模板",
                        typeRes: "Public",
                        mapType: "Templete"
                    }).then(function (res) {
                        if (res.data.status === "ok" && res.data.result) {
                            var templates = [];
                            res.data.result.length > 0 && res.data.result.map(function (template) {
                                templates.push({
                                    id: template.Id,
                                    title: template.Name,
                                    author: template.Author,
                                    update: template.UpdateTime.split(' ')[0],
                                    version: "1.0.0",
                                    img: URL_CFG.img + _.replace(template.PicPath, '{$}', 'big'),
                                    brief: template.Detail,
                                    detail: template.Detail2
                                })
                            });
                            $rootScope.$broadcast('mask:show', {
                                showMask: true,
                                template: '<create-panel></create-panel>',
                                overlay: {
                                    title: '',
                                    templates: templates,
                                    pagination: {
                                        totalItems: res.data.count,
                                        maxSize: 5,
                                        pageNo: 1,
                                        pageSize: 8,
                                        maxPage: Math.ceil(res.data.count / 12)
                                    },
                                    doc: {
                                        userId: 1,
                                        autor: '姚志武'
                                    },
                                    choose: true,
                                    create: false
                                }
                            })
                        }
                        else {
                            console.log(res.data);
                        }
                    });
                }
            };



            /**
             * 监听"文档打开"事件
             */
            $scope.$on('doc:open', function (event, value) {
                // vm.doc = {
                //     docId: value.docId,
                //     userId: value.userId,
                //     name: value.name,
                //     name2: value.name2,
                //     author: value.author,
                //     detail: value.detail,
                //     detail2: value.detail2,
                //     tagName: value.tagName
                // };
                vm.doc = value;
                console.log(vm.doc);
                // vm.doc.docId=44;///地图文档编号
                // vm.doc.userId=1;///地图文档用户
                // vm.doc.name="老河口测试地图";///地图文档名称
                extent = [parseFloat(vm.doc.xmin), parseFloat(vm.doc.ymin), parseFloat(vm.doc.xmax), parseFloat(vm.doc.ymax)];
                initMap(vm.doc.mapServerPath, extent);
                //initMap(URL_CFG.api + 'MapService.svc/Export',extent);
                getUserGdb();
                getMapInfo();
            });

            /**
             * 监听"文档关闭"事件
             */
            $scope.$on('doc:close', function (event, value) {
                // Todo: save close
            });

            /**
             * 监听"文档保存"事件，保存文档
             */
            $scope.$on('doc:save', function (event, value) {
                // Todo: save doc
            });

            /**
             * 监听"文档更新"事件，如有图层更新，则重新获取图层列表信息
             */
            $scope.$on('layer:change', function (event, value) {
                getMapInfo();
            });

            /**
             * 监听"符号改变"事件
             */
            $scope.$on('symbol:change', function (event, value) {
                // Todo: change symbol
            });


            // $scope.$broadcast('doc:open', {
            //     docId: 44,
            //     userId: 1,
            //     name: '老河口测试地图',
            //     name2: '来自前端的老河口测试地图',
            //     author: '姚志武',
            //     detail: '老河口测试地图，老河口测试地图',
            //     detail2: '老河口测试地图，老河口测试地图，老河口测试地图',
            //     tagName: '城管'
            // });
            // finishCreateMap();


            function initMap(url, extent) {
                map = new ol.Map({
                    controls: ol.control.defaults().extend([
                        new ol.control.ScaleLine()
                    ]),
                    layers: [new ol.layer.Image()],
                    target: 'map',
                    view: new ol.View({
                        center: [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2],
                        // zoom: 15,
                        extent: extent,
                        resolution: 96,
                        //projection: 'EPSG:3857'
                    })
                });
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

            function getUserGdb() {
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
                        for (var i = 0; i < vm.layers.length; i++) {
                            addShowAttribute(vm.layers[i]);
                        }
                    }
                });
            }

            function addShowAttribute(layer) {
                layer.showChild = true;     //是否显示子节点
                layer.showSelf = true;      //是否显示自己
                layer.ischeck = 1;          //1.选中, 2.未选中, 3.子节点未全部选中
                if (layer.subLayerIds !== null && layer.subLayerIds.length !== 0) {
                    for (var i = 0; i < layer.subLayerIds.length; i++) {
                        addShowAttribute(layer.subLayerIds[i]);
                    }
                }
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
                initMap(URL_CFG.api + 'MapService.svc/Export');
                getMapInfo();
            }
        }])
})(angular);