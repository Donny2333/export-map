/**
 * Created by Donny on 17/6/22.
 */
(function(angular) {
    'use strict';

    angular.module('export-map.controllers')
        .controller('QueryPanelController', ['$scope', '$rootScope', 'Doc', function($scope, $rootScope, Doc) {
            var vm = $scope.vm;
            vm.overlay.field = {
                select: 0,
                data: []
            };
            vm.overlay.operator = {
                select: 0,
                data: [{
                    id: 0,
                    value: '>'
                }, {
                    id: 1,
                    value: '='
                }, {
                    id: 2,
                    value: '<'
                }, {
                    id: 3,
                    value: 'LIKE'
                }]
            };
            vm.overlay.param = {
                select: 0,
                data: [{
                    id: 0,
                    value: 1
                }, {
                    id: 1,
                    value: 2
                }, {
                    id: 2,
                    value: 3
                }]
            };
            vm.overlay.query = [];

            getLayerField();

            $scope.add = function() {
                var value = [
                    vm.overlay.field.data[vm.overlay.field.select].value,
                    vm.overlay.operator.data[vm.overlay.operator.select].value,
                    vm.overlay.param.data[vm.overlay.param.select].value
                ].join(' ');

                !_.includes(vm.overlay.query, value) && vm.overlay.query.push(value);
            };

            $scope.delete = function(index) {
                layer.confirm('确定删除？', {
                    btn: ['确定', '取消']
                }, function() {
                    layer.closeAll();
                    $scope.$apply(function() {
                        vm.overlay.query.splice(index, 1);
                    });
                }, function() {
                    layer.close();
                });
            };

            $scope.commit = function() {
                $scope.closeMask();
                Doc.queryDataOnLayer({
                    docId: vm.overlay.doc.docId,
                    name: vm.overlay.doc.name,
                    userId: vm.overlay.doc.userId,
                    layerIndex: vm.overlay.layer.id,
                    where: '1=1',
                    returnGeo: true,
                    pageNo: 1,
                    pageNum: 10
                }).then(function(res) {
                    var data = [];
                    res.data.result.map(function(o) {
                        data.push(o);
                    });
                    $rootScope.$broadcast('map:toggleTable', {
                        table: {
                            layerIndex: vm.overlay.layer.id,
                            queryString: '1=1',
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
                }).then(function(res) {
                    vm.overlay.field.data = [];
                    res.data.result.map(function(v, i) {
                        vm.overlay.field.data.push({
                            id: i,
                            value: v
                        })
                    });
                }, function(err) {
                    console.log(err);
                });
            }
        }])
})(angular);
