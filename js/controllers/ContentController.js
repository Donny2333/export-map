/**
 * Created by Donny on 17/5/16.
 */
(function (angular) {
    'use strict';

    angular.module('export-map.controllers')
        .controller('ContentController', ['$scope', '$rootScope', 'Symbol', function ($scope, $rootScope, Symbol) {
            $scope.expandLayer = function (layer) {
                var i;
                // console.log(layer);
                if (layer.showChild) {
                    for (i = 0; i < layer.subLayerIds.length; i++) {
                        hide(layer.subLayerIds[i])
                    }
                } else {
                    for (i = 0; i < layer.subLayerIds.length; i++) {
                        expand(layer.subLayerIds[i])
                    }
                }
                layer.showChild = !layer.showChild;
            };

            $scope.imgUrl = "";

            //check状态
            $scope.hideLayer = function (layers, layer) {
                // console.log(layer);
                // console.log("hidelayer");
                if (layer.ischeck === 2 || layer.ischeck === 3) {
                    choiceCheck(layer);
                } else {
                    cancelCheck(layer);
                }
                findChindById(layers, layer.pid);
            };

            console.log($scope.$parent.vm.doc);

            $scope.showPreview = function (layer) {
                console.log("显示" + layer);

                layer.showPreview = !layer.showPreview;
                Symbol.GetLayerSymbolInfo({
                    docId: $scope.$parent.vm.doc.docId,
                    userId: $scope.$parent.vm.doc.userId,
                    name: $scope.$parent.vm.doc.name,
                    layerIndex: layer.id
                }).then(function (res) {
                    // if() {
                    //
                    // }
                    console.log(res.data.result);
                    $scope.imgUrl = res.data.result.renderSymbolInfo.SymbolPreview;
                })
            };

            $scope.changePreview = function () {
                Symbol.getSymbolItemListFromDB({
                    styleId: 1,
                    pageNo: 0,
                    pageSize: 16
                }).then(function (res) {
                    if (res.status === 200) {
                        $rootScope.$broadcast('mask:show', {
                            showMask: true,
                            template: '<symbol-panel></symbol-panel>',
                            overlay: {
                                styleId: 1,
                                title: "test",
                                data: res.data.result,
                                pagination: {
                                    totalItems: res.data.count,
                                    maxSize: 5,
                                    pageNo: 1,
                                    pageSize: 16,
                                    maxPage: Math.ceil(res.data.count / 10)
                                }
                            }
                        })
                    }
                })
            };

            $scope.deleteLayer = function (layer) {
                console.log("删除");
                Symbol.RemoveLayerFromMap({
                    docId: $scope.$parent.vm.doc.docId,
                    userId: $scope.$parent.vm.doc.userId,
                    name: $scope.$parent.vm.doc.name,
                    layerIndex: layer.id
                }).then(function (res) {
                    if(res.data.status==="ok"){
                        //刷新内容
                        console.log(res.data.status)
                        $scope.$emit('layer:change', {})
                    }

                })
            };


            //父节点随子节点状态改变而变化
            function findChindById(layers, pid) {
                // console.log("通过id获得节点" + layers);
                if (pid > 0) {
                    //判断是否找到父节点
                    var i;
                    var find = false;
                    for (i = 0; i < layers.length; i++) {
                        if (layers[i].id === pid) {
                            judgeCheck(layers[i]);
                            findChindById($scope.$parent.vm.layers, layers[i].pid);
                            find = true;
                            break;
                        }
                    }
                    //未找到父节点，递进继续查找
                    if (!find) {
                        for (i = 0; i < layers.length; i++) {
                            if (layers[i].subLayerIds !== null && layers[i].subLayerIds.length !== 0) {
                                findChindById(layers[i].subLayerIds, pid);
                            }
                        }
                    }
                }
            }

            //判断根据子节点判断状态并修改
            function judgeCheck(layer) {
                if (layer.subLayerIds !== null && layer.subLayerIds.length !== 0) {
                    var a = 0;
                    var b = 0;
                    for (var i = 0; i < layer.subLayerIds.length; i++) {
                        // console.log(layer.id + "的长度：" + layer.subLayerIds.length);
                        if (layer.subLayerIds[i].ischeck === 1) {
                            a++;
                            // console.log("a+1");
                        } else if (layer.subLayerIds[i].ischeck === 2) {
                            // console.log("b+1");
                            b++;
                        }
                    }
                    if (a === layer.subLayerIds.length) {
                        layer.ischeck = 1;
                    } else if (b === layer.subLayerIds.length) {
                        layer.ischeck = 2;
                    } else {
                        layer.ischeck = 3;
                    }
                }
                // console.log(layer.id + "check状态为" + layer.ischeck);
            }


            function choiceCheck(layer) {
                layer.ischeck = 1;
                if (layer.subLayerIds !== null && layer.subLayerIds.length !== 0) {
                    for (var i = 0; i < layer.subLayerIds.length; i++) {
                        choiceCheck(layer.subLayerIds[i])
                    }
                }
                // console.log(layer.id + "check状态为" + layer.ischeck);
            }


            function cancelCheck(layer) {
                layer.ischeck = 2;
                if (layer.subLayerIds !== null && layer.subLayerIds.length !== 0) {
                    for (var i = 0; i < layer.subLayerIds.length; i++) {
                        cancelCheck(layer.subLayerIds[i])
                    }
                }
                // console.log(layer.id + "check状态为" + layer.ischeck);
            }


            function expand(layer) {
                layer.showSelf = true;
                if (layer.subLayerIds !== null && layer.subLayerIds.length !== 0) {
                    for (var i = 0; i < layer.subLayerIds.length; i++) {
                        expand(layer.subLayerIds[i]);
                    }
                }
            }

            function hide(layer) {
                layer.showSelf = false;
                if (layer.subLayerIds !== null && layer.subLayerIds.length !== 0) {
                    for (var i = 0; i < layer.subLayerIds.length; i++) {
                        hide(layer.subLayerIds[i]);
                    }
                }
            }
        }])
})(angular);