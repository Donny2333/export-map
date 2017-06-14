/**
 * Created by Donny on 17/5/18.
 */
(function (angular) {
    'use strict';

    angular.module('export-map.controllers')
        .controller('SymbolPanelController', ['$scope', '$rootScope', '$http', 'Symbol', function ($scope, $rootScope, $http, Symbol) {
            var vm = $scope.vm;

            // 从符号库页面进入
            if (!vm.overlay.layer) {
                vm.overlay.select = {};
                angular.copy(vm.overlay.data[0], vm.overlay.select);
            }

            $scope.pageChanged = function () {
                getSymbolItemListFromDB(vm.overlay.styleId, vm.overlay.pagination.pageNo - 1, vm.overlay.pagination.pageSize)
            };

            $scope.change = function (value, name) {
                if (value.indexOf('rgb') >= 0) {
                    value = value.substr(4, value.length - 5);
                    vm.overlay.select[name] = value;
                }
            };

            $scope.selectSymbol = function (symbol) {
                vm.overlay.select = {};
                angular.copy(symbol, vm.overlay.select);
            };

            $scope.preview = function () {
                var param;
                if (vm.overlay.select.Id) {
                    param = _.merge(_.pick(vm.overlay.select, [
                        'StyleId',
                        'SymbolType',
                        'SymbolName',
                        'Color',
                        'Size',
                        'Angle',
                        'Width',
                        'OutlineColor',
                        'OutlineWidth',
                        'FillColor'
                    ]), {
                        picHeight: 50,
                        picWidth: 50,
                        styleid: vm.overlay.styleId
                    });
                    Symbol.getSymbolPreview(param).then(function (res) {
                        if (res.status === 200) {
                            console.log(res.data);
                            vm.overlay.select.SymbolPreview = res.data.result;
                        }
                    })
                } else {
                    // 从地图编辑页面进入
                    param = _.merge(_.pick(vm.overlay.select, [
                        'StyleId',
                        'SymbolName',
                        'PointColor',
                        'PointSize',
                        'PointAngle',
                        'LineColor',
                        'LineWidth',
                        'FillColor'
                    ]), {
                        picHeight: 50,
                        picWidth: 50,
                        styleid: vm.overlay.styleId,
                        docId: vm.overlay.doc.docId,
                        name: vm.overlay.doc.name,
                        userId: vm.overlay.doc.userId,
                        layerIndex: vm.overlay.layer.id
                    });

                    Symbol.getLayerSymbolInfo(param).then(function (res) {
                        vm.overlay.select.SymbolPreview = res.data.result.RenderSymbolInfo.SymbolPreview;
                    });
                }
            };

            $scope.setSymbol = function (select) {
                console.log(select);
                var symbol;
                var loading = layer.load(1, {
                    shade: [0.1, '#000']
                });
                switch (select.SymbolInfo.RenderSymbolInfo.SymbolInfo.ClassName) {
                    case 'Marker Symbols' :
                        symbol = {
                            RenderSymbolInfo: {
                                Label: select.SymbolInfo.RenderSymbolInfo.Label,
                                SymbolInfo: {
                                    Label: select.SymbolInfo.RenderSymbolInfo.SymbolInfo.Label,
                                    Angle: select.PointAngle,
                                    ClassName: "Marker Symbols",
                                    Color: select.PointColor,
                                    Fieldvalues: select.SymbolInfo.RenderSymbolInfo.SymbolInfo.Fieldvalues,
                                    Size: select.PointSize,
                                    StylePath: select.StylePath,
                                    SymbolName: select.SymbolName
                                },
                                Value: select.SymbolInfo.RenderSymbolInfo.Value
                            },
                            Symboltype: "Marker Symbols",
                            Type: "Single symbol"
                        };
                        break;

                    case 'Line Symbols' :
                        symbol = {
                            RenderSymbolInfo: {
                                Label: select.SymbolInfo.RenderSymbolInfo.Label,
                                SymbolInfo: {
                                    Label: select.SymbolInfo.RenderSymbolInfo.SymbolInfo.Label,
                                    Width: select.LineWidth,
                                    ClassName: "Line Symbols",
                                    Color: select.LineColor,
                                    Fieldvalues: select.SymbolInfo.RenderSymbolInfo.SymbolInfo.Fieldvalues,
                                    StylePath: select.StylePath,
                                    SymbolName: select.SymbolName
                                },
                                Value: select.SymbolInfo.RenderSymbolInfo.Value
                            },
                            Symboltype: "Line Symbols",
                            Type: "Single symbol"
                        };
                        break;

                    case 'Fill Symbols' :
                        symbol = {
                            RenderSymbolInfo: {
                                Label: select.SymbolInfo.RenderSymbolInfo.Label,
                                SymbolInfo: {
                                    Label: select.SymbolInfo.RenderSymbolInfo.SymbolInfo.Label,
                                    OutlineWidth: select.LineWidth,
                                    ClassName: "Fill Symbols",
                                    OutlineColor: select.LineColor,
                                    FillColor: select.FillColor,
                                    Fieldvalues: select.SymbolInfo.RenderSymbolInfo.SymbolInfo.Fieldvalues,
                                    StylePath: select.StylePath,
                                    SymbolName: select.SymbolName
                                },
                                Value: select.SymbolInfo.RenderSymbolInfo.Value
                            },
                            Symboltype: "Fill Symbols",
                            Type: "Single symbol"
                        };
                        break;

                    default:
                        break;
                }

                var param = {
                    docId: vm.overlay.doc.docId,
                    name: vm.overlay.doc.name,
                    userId: vm.overlay.doc.userId,
                    layerIndex: vm.overlay.layer.id,
                    symbolInfo: symbol
                };

                Symbol.setLayerSymbolInfo(param).then(function (res) {
                    if (res.data.result) {
                        $rootScope.$broadcast('layer:change');
                        $scope.vm.showMask = false;
                        $scope.vm.overlay = {};
                        layer.closeAll('loading');
                        layer.msg('符号设置成功', {icon: 1});
                    } else {
                        layer.closeAll('loading');
                        layer.msg('符号设置失败', {icon: 1});
                    }
                })
            };

            function getSymbolItemListFromDB(styleId, pageNo, pageSize) {
                var symbolInfo = vm.overlay.select.SymbolInfo || {};
                Symbol.getSymbolItemListFromDB({
                    styleId: styleId,
                    pageNo: pageNo,
                    pageSize: pageSize,
                    geometryType: vm.overlay.layer && vm.overlay.layer.geometryType
                }).then(function (res) {
                    if (res.status === 200) {
                        vm.overlay.data = res.data.result;
                        vm.overlay.pagination.totalItems = res.data.count;
                        vm.overlay.pagination.maxPage = Math.ceil(res.data.count / vm.overlay.pagination.pageSize);
                        vm.overlay.select = {};
                        angular.copy(vm.overlay.data[0], vm.overlay.select);
                        vm.overlay.select.SymbolInfo = symbolInfo;
                    }
                })
            }
        }])
})(angular);