/**
 * Created by Donny on 17/3/22.
 */
(function (angular) {
    'use strict';

    angular.module('export-map.controllers', [])
        .controller('AppController', ['$scope', '$rootScope', '$state', '$timeout', 'Router', 'Doc', 'Data', 'URL_CFG', 'uuid',
            function ($scope, $rootScope, $state, $timeout, Router, Doc, Data, URL_CFG, uuid) {
                var vm = $scope.vm = {
                    menus: Router.list().slice(0, 2),
                    showTable: false,
                    table: {}
                };

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

                // 刷新浏览器回到图库页面
                if (!vm.doc || !vm.doc.docId) {
                    $state.go("app.explorer.files");
                }

                $scope.go = function ($event, menu) {
                    $event.preventDefault();
                    $state.go([menu.sref, menu.sub].join('.'));
                };

                $scope.closeTable = function () {
                    vm.showTable = false;
                    $timeout(function () {
                        map && map.updateSize();
                    }, 0);
                };

                $scope.createOrClose = function () {
                    if (vm.doc && vm.doc.docId) {
                        // 关闭文档
                        vm.doc = {};
                        vm.layers = [];
                        vm.menus = Router.list().slice(0, 2);
                        map.removeLayer(map.getLayers().item(0));
                        $state.go('app.explorer.files');
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
                        });
                    }
                };

                $scope.save = function () {

                };

                $scope.publish = function () {
                    vm.doc.extent = map.getView().calculateExtent();
                    $rootScope.$broadcast('mask:show', {
                        showMask: true,
                        template: '<publish-panel></publish-panel>',
                        overlay: {
                            title: '地图发布',
                            doc: vm.doc
                        }
                    })
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
                    vm.menus = Router.list();
                    vm.doc = value;
                    var extent = [parseFloat(vm.doc.xmin), parseFloat(vm.doc.ymin), parseFloat(vm.doc.xmax), parseFloat(vm.doc.ymax)];

                    if (map) {
                        map.addLayer(new ol.layer.Image());
                        map.getLayers().item(0).setSource(new ol.source.ImageWMS({
                            url: URL_CFG.api + 'MapService.svc/Export',
                            attributions: '© <a href="http://www.dx-tech.com/">HGT</a>',
                            imageExtent: map.getView().calculateExtent(),
                            params: {
                                docId: vm.doc.docId,
                                userId: vm.doc.userId,
                                name: vm.doc.name,
                                random: uuid.create()
                            }
                        }));
                    } else {
                        initMap(URL_CFG.api + 'MapService.svc/Export', extent);
                    }
                    getUserGdb();
                    getMapInfo();
                });

                /**
                 * 监听"图层更新"事件，如有图层更新，则重新获取图层列表信息
                 */
                $scope.$on('layer:change', function (event, value) {
                    getMapInfo();
                    map.getLayers().item(0).setSource(new ol.source.ImageWMS({
                        url: URL_CFG.api + 'MapService.svc/Export',
                        attributions: '© <a href="http://www.dx-tech.com/">HGT</a>',
                        imageExtent: map.getView().calculateExtent(),
                        params: {
                            docId: vm.doc.docId,
                            userId: vm.doc.userId,
                            name: vm.doc.name,
                            random: uuid.create()
                        }
                    }));
                });

                /**
                 * 监听"地图更新"事件
                 */
                $scope.$on('map:change', function (event, value) {
                    var loading = layer.load(1, {
                        shade: [0.1, '#000']
                    });
                    Doc.setLayerVisible({
                        docId: vm.doc.docId,
                        userId: vm.doc.userId,
                        name: vm.doc.name,
                        layerIndex: value.layers,
                        isVisible: true
                    }).then(function (res) {
                        layer.closeAll('loading');
                        map.getLayers().item(0).setSource(new ol.source.ImageWMS({
                            url: URL_CFG.api + 'MapService.svc/Export',
                            attributions: '© <a href="http://www.dx-tech.com/">HGT</a>',
                            imageExtent: map.getView().calculateExtent(),
                            params: {
                                docId: vm.doc.docId,
                                userId: vm.doc.userId,
                                name: vm.doc.name,
                                random: uuid.create()
                            }
                        }));
                    })
                });

                /**
                 * 监听"表格开关"事件
                 */
                $scope.$on('map:toggleTable', function (event, value) {
                    $scope.vm.showTable = !$scope.vm.showTable;
                    if (value) {
                        $scope.vm.table = value.table;
                    }
                    $timeout(function () {
                        map && map.updateSize();
                    }, 0);
                });

                /**
                 * 监听"符号改变"事件
                 */
                $scope.$on('symbol:change', function (event, value) {
                    // Todo: change symbol
                });

                function initMap(url, extent) {
                    map = new ol.Map({
                        target: 'map',
                        layers: [new ol.layer.Image()],
                        controls: ol.control.defaults().extend([
                            new ol.control.ScaleLine()
                        ]),
                        view: new ol.View({
                            extent: extent,
                            random: uuid.create(),
                            center: [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2],
                            projection: new ol.proj.Projection({
                                code: 'EPSG:' + vm.doc.srcID,
                                units: 'm'
                            })
                        })
                    });

                    // set map's resolution
                    var size = map.getSize();
                    var resolution = (extent[2] - extent[0]) / size[0];
                    map.getView().setResolution(resolution);

                    map.getLayers().item(0).setSource(new ol.source.ImageWMS({
                        url: url,
                        // ratio: 1,
                        imageExtent: extent,
                        attributions: '© <a href="http://www.dx-tech.com/">HGT</a>',
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
                        } else {
                            // Todo: 创建用户的gdb
                        }
                    });
                }

                function getMapInfo() {
                    var loading = layer.load(1, {
                        shade: [0.1, '#000']
                    });
                    Doc.getMapInfo({
                        docId: vm.doc.docId,
                        userId: vm.doc.userId,
                        name: vm.doc.name
                    }).then(function (res) {
                        if (res.data.status === "ok" && res.data.result) {
                            vm.layers = res.data.result.layers;
                            for (var i = 0; i < vm.layers.length; i++) {
                                addShowAttribute(vm.layers[i]);
                            }
                            judgeCheckBox(vm.layers);
                            layer.closeAll('loading');
                        } else {
                            layer.closeAll('loading');
                            layer.open({
                                title: '地图打开失败',
                                content: res.data.msg
                            });
                        }
                    });
                }

                function addShowAttribute(layer) {
                    layer.showChild = true;     //是否显示子节点
                    layer.showSelf = true;      //是否显示自己
                    layer.ischeck = 2;          //1.选中, 2.未选中, 3.子节点未全部选中
                    if (layer.subLayerIds !== null && layer.subLayerIds.length !== 0) {
                        for (var i = 0; i < layer.subLayerIds.length; i++) {
                            addShowAttribute(layer.subLayerIds[i]);
                        }
                    }
                }

                function judgeCheckBox(layers) {
                    for (var i = 0; i < layers.length; i++) {
                        if (layers[i].defaultVisibility === true && layers[i].subLayerIds === null) {
                            layers[i].ischeck = 1;
                        } else if (layers[i].defaultVisibility === true && layers[i].subLayerIds !== null) {
                            check = 1;
                            layers[i].ischeck = check;
                            ischeck(layers[i].subLayerIds);
                            layers[i].ischeck = check;
                            judgeCheckBox(layers[i].subLayerIds);
                        }
                    }
                }

                var check = 1;

                function ischeck(layers) {
                    for (var i = 0; i < layers.length; i++) {
                        if (layers[i].defaultVisibility === false) {
                            check = 3;
                            return;
                        }
                        if (layers[i].subLayerIds !== null) {
                            ischeck(layers[i].subLayerIds);
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