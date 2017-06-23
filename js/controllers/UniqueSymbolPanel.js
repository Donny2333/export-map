/**
 * Created by Donny on 17/5/19.
 */
(function (angular) {
    'use strict';

    angular.module('export-map.controllers')
        .controller('UniquePanelController', ['$scope', '$rootScope', '$q', 'Doc', 'Symbol', function ($scope, $rootScope, $q, Doc, Symbol) {
            var vm = $scope.vm;

            vm.overlay.select = null;
            vm.overlay.table = {};
            vm.overlay.field = null;
            vm.overlay.menus = [];
            vm.overlay.uniqueList = [];
            vm.overlay.columns = [{
                checkbox: true,
                align: 'center',
                valign: 'middle'
            }, {
                field: 'SymbolInfo',
                title: 'Symbol',
                align: 'center',
                valign: 'middle',
                width: '100px',
                clickToSelect: false,
                formatter: function (value) {
                    return '<img src="' + value.SymbolPreview + '"style="display:inline-block;height: 20px;width: 20px">';
                },
                events: {
                    'click img': function (e, value, row, index) {
                        // Todo: open symbol panel
                        console.log('open symbol panel');
                    }
                }
            }, {
                field: 'Value',
                title: 'Value',
                align: 'center',
                valign: 'middle'
            }, {
                field: 'Label',
                title: 'Label',
                align: 'center',
                valign: 'middle'
            }];

            $scope.$watch('vm.overlay.tab', function (value) {
                if (value === 0 && !vm.overlay.select) {
                    // 展示单一符号渲染面板
                    getLayerSymbols(vm.overlay.layer).then(function (symbols) {
                        vm.overlay.select = symbols[0].SymbolInfo;
                    });
                } else if (value === 1 && !vm.overlay.menus.length) {
                    // 展示唯一值符号渲染面板
                    Doc.getLayerField({
                        docId: vm.overlay.doc.docId,
                        userId: vm.overlay.doc.userId,
                        name: vm.overlay.doc.name,
                        layerIndex: vm.overlay.layer.id
                    }).then(function (res) {
                        vm.overlay.menus = res.data.result;
                    }, function (err) {
                        console.log(err);
                    });
                }
            });

            $scope.selectSymbol = function (symbol) {
                angular.copy(symbol, vm.overlay.select);
            };

            $scope.change = function (value, name) {
                if (value.indexOf('rgb') >= 0) {
                    value = value.substr(4, value.length - 5);
                    vm.overlay.select[name] = value;
                }
            };

            $scope.pageChanged = function () {
                getSymbolItemListFromDB(vm.overlay.styleId, vm.overlay.pagination.pageNo - 1, vm.overlay.pagination.pageSize)
            };

            $scope.preview = function () {
                var param = _.merge(_.pick(vm.overlay.select, [
                    "StyleId",
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
                    docId: vm.overlay.doc.docId,
                    name: vm.overlay.doc.name,
                    userId: vm.overlay.doc.userId,
                    layerIndex: vm.overlay.layer.id
                });

                Symbol.getLayerSymbolInfo(param).then(function (res) {
                    vm.overlay.select.SymbolPreview = res.data.result.RenderSymbolInfo.SymbolInfo.SymbolPreview;
                });
            };

            $scope.checkALl = function () {
                Doc.getLayerUniqueFieldVal({
                    docId: vm.overlay.doc.docId,
                    userId: vm.overlay.doc.userId,
                    name: vm.overlay.doc.name,
                    layerIndex: vm.overlay.layer.id,
                    fldName: vm.overlay.field,
                    picHeight: 20,
                    picWidth: 20
                }).then(function (res) {
                    var uniqueList = [];
                    var symbols = res.data.result.RenderSymbols;
                    var defaultSymbol = res.data.result.DefaultRenderSymbol;

                    if (defaultSymbol) {
                        uniqueList.push({
                            Value: defaultSymbol.Value,
                            Label: defaultSymbol.Label,
                            SymbolInfo: defaultSymbol.SymbolInfo
                        });
                    }
                    symbols.map(function (symbol) {
                        uniqueList.push({
                            Value: symbol.Value,
                            Label: symbol.Label,
                            SymbolInfo: symbol.SymbolInfo
                        })
                    });
                    vm.overlay.uniqueList = uniqueList;
                });
            };

            $scope.delete = function () {
                var selections = vm.overlay.table.bootstrapTable('getSelections');
                vm.overlay.table.bootstrapTable('remove', {
                    field: 'Value',
                    values: _.concat(_.map(selections, function (select) {
                        return select['Value'];
                    }))
                });
            };

            $scope.deleteAll = function () {
                vm.overlay.uniqueList = [];
            };

            $scope.commit = function () {
                var renderInfo;
                var loading = layer.load(1, {
                    shade: [0.1, '#000']
                });
                if (vm.overlay.tab === 0) {
                    // 单一符号渲染
                    renderInfo = {
                        Type: "Single symbol",
                        RenderSymbolInfo: {
                            Label: vm.overlay.symbol[0].Label,
                            Value: vm.overlay.symbol[0].Value,
                            SymbolInfo: (function (select) {
                                switch (select.SymbolType) {
                                    case 'Marker Symbols' :
                                        return {
                                            SymbolType: "Marker Symbols",
                                            Angle: select.Angle,
                                            Color: select.Color,
                                            Size: select.Size,
                                            StyleId: select.StyleId,
                                            SymbolName: select.SymbolName
                                        };

                                    case 'Line Symbols' :
                                        return {
                                            SymbolType: "Line Symbols",
                                            Width: select.Width,
                                            Color: select.Color,
                                            StyleId: select.StyleId,
                                            SymbolName: select.SymbolName
                                        };

                                    case 'Fill Symbols' :
                                        return {
                                            SymbolType: "Fill Symbols",
                                            OutlineWidth: select.OutlineWidth,
                                            OutlineColor: select.OutlineColor,
                                            FillColor: select.FillColor,
                                            StyleId: select.StyleId,
                                            SymbolName: select.SymbolName
                                        };
                                }
                            })(vm.overlay.select)
                        }
                    };
                } else {
                    // 唯一值符号渲染
                    var defaultSymbol = vm.overlay.uniqueList.shift();
                    var useDefault = defaultSymbol.Value === 'default';
                    renderInfo = {
                        Type: "Unique values",
                        UseDefaultSymbol: useDefault,
                        FieldList: [vm.overlay.field],
                        DefaultRenderSymbol: useDefault ? defaultSymbol : {
                            Label: '',
                            Value: '',
                            SymbolInfo: {}
                        },
                        RenderSymbols: useDefault ? vm.overlay.uniqueList : _.concat(defaultSymbol, vm.overlay.uniqueList)
                    };
                }

                Symbol.setLayerSymbolInfo({
                    docId: vm.overlay.doc.docId,
                    name: vm.overlay.doc.name,
                    userId: vm.overlay.doc.userId,
                    layerIndex: vm.overlay.layer.id,
                    RenderInfo: renderInfo
                }).then(function (res) {
                    if (res.data.result) {
                        $scope.closeMask();
                        layer.msg('符号设置成功', {icon: 1});
                        $rootScope.$broadcast('layer:change');
                    } else {
                        layer.closeAll('loading');
                        layer.msg('符号设置失败', {icon: 2});
                    }
                }, function (err) {
                    console.log(err);
                });
            };

            function getLayerSymbols(layer) {
                var deferred = $q.defer();
                var symbols = [];

                Symbol.getLayerSymbolInfo({
                    docId: vm.overlay.doc.docId,
                    userId: vm.overlay.doc.userId,
                    name: vm.overlay.doc.name,
                    layerIndex: layer.id,
                    picHeight: 50,
                    picWidth: 50
                }).then(function (res) {
                    if (res.status === 200 && res.data.status === 'ok') {
                        switch (res.data.result.Type) {
                            // 单一符号渲染
                            case 'Single symbol':
                                symbols.push(res.data.result.RenderSymbolInfo);
                                break;

                            // 唯一值符号渲染
                            case 'Unique values':
                                symbols = (res.data.result.UseDefaultSymbol ? [res.data.result.DefaultRenderSymbol] : [])
                                    .concat(res.data.result.RenderSymbols);
                                break;

                            default:
                                break;
                        }
                        deferred.resolve(symbols);
                    }
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            }

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
                    }
                })
            }
        }])
})(angular);