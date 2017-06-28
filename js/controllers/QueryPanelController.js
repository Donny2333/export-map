/**
 * Created by Donny on 17/6/22.
 */
(function (angular) {
    'use strict';

    angular.module('export-map.controllers')
        .controller('QueryPanelController', ['$scope', '$rootScope', 'Doc', function ($scope, $rootScope, Doc) {
            var vm = $scope.vm;
            vm.overlay.field = [];
            vm.overlay.operator = [
                {
                    id: 0,
                    value: '='
                }, {
                    id: 1,
                    value: '<>'
                }, {
                    id: 2,
                    value: 'Like'
                }, {
                    id: 3,
                    value: '>'
                }, {
                    id: 4,
                    value: '>='
                }, {
                    id: 5,
                    value: 'And'
                }, {
                    id: 6,
                    value: '<'
                }, {
                    id: 7,
                    value: '<='
                }, {
                    id: 8,
                    value: 'Not'
                }, {
                    id: 9,
                    value: '_'
                }, {
                    id: 10,
                    value: '%'
                }, {
                    id: 11,
                    value: 'Is'
                }, {
                    id: 12,
                    value: 'Or'
                }];
            vm.overlay.param = [];
            vm.overlay.query = "";

            getLayerField();

            $scope.add = function (value) {
                vm.overlay.query += value + ' ';
            };

            $scope.getValues = function () {
                // Todo: Query values form back end.
                vm.overlay.param = [
                    {
                        id: 0,
                        value: 1
                    }, {
                        id: 1,
                        value: 2
                    }, {
                        id: 2,
                        value: 3
                    }, {
                        id: 3,
                        value: 4
                    }, {
                        id: 4,
                        value: 5
                    }];
            };

            $scope.clear = function () {
                vm.overlay.query = "";
            };

            $scope.delete = function (index) {
                layer.confirm('确定删除？', {
                    btn: ['确定', '取消']
                }, function () {
                    layer.closeAll();
                    $scope.$apply(function () {
                        vm.overlay.query.splice(index, 1);
                    });
                }, function () {
                    layer.close();
                });
            };

            $scope.commit = function () {
                $scope.closeMask();
                Doc.queryDataOnLayer({
                    docId: vm.overlay.doc.docId,
                    name: vm.overlay.doc.name,
                    userId: vm.overlay.doc.userId,
                    layerIndex: vm.overlay.layer.id,
                    where: vm.overlay.query,
                    returnGeo: true,
                    pageNo: 1,
                    pageNum: 10
                }).then(function (res) {
                    var data = [];
                    res.data.result.map(function (o) {
                        data.push(o);
                    });
                    $rootScope.$broadcast('map:toggleTable', {
                        table: {
                            layerIndex: vm.overlay.layer.id,
                            queryString: vm.overlay.query,
                            pageNo: 1,
                            pageSize: 10,
                            head: '查询列表',
                            data: data
                        },
                        pagination: {
                            totalItems: res.data.count,
                            maxSize: 5,
                            pageNo: 1,
                            pageSize: 10,
                            maxPage: Math.ceil(res.data.count / 10)
                        }
                    });
                });
            };

            function getLayerField() {
                Doc.getLayerField({
                    docId: vm.overlay.doc.docId,
                    userId: vm.overlay.doc.userId,
                    name: vm.overlay.doc.name,
                    layerIndex: vm.overlay.layer.id
                }).then(function (res) {
                    vm.overlay.field = [];
                    res.data.result.map(function (v, i) {
                        vm.overlay.field.push({
                            id: i,
                            value: v
                        })
                    });
                }, function (err) {
                    console.log(err);
                });
            }
        }])
})(angular);
