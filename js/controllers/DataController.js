/**
 * Created by Donny on 17/5/16.
 */
(function (angular) {
    'use strict';

    angular.module('export-map.controllers')
        .controller('DataController', ['$scope', '$rootScope', 'Data', function ($scope, $rootScope, Data) {
            var vm = $scope.vm = {
                data: [],
                typeRes: {
                    id: 1,
                    data: [{
                        id: 0,
                        name: 'Users',
                        text: '用户数据'
                    }, {
                        id: 1,
                        name: 'Public',
                        text: '公共数据'
                    }]
                },
                keywords: {
                    id: 0,
                    data: [{
                        id: 0,
                        name: '',
                        text: '按名称'
                    }, {
                        id: 1,
                        name: '',
                        text: '按坐标系'
                    }]
                },
                pagination: {
                    totalItems: 0,
                    maxSize: 5,
                    pageNo: 1,
                    pageSize: 10,
                    maxPage: 1
                }
            };

            $scope.change = function (index) {
                if (vm.typeRes.id !== index) {
                    vm.typeRes.id = index;
                    getMapDataList(vm.pagination.pageNo - 1, vm.pagination.pageSize, vm.typeRes.data[vm.typeRes.id].name, 1);
                }
            };

            $scope.pageChanged = function () {
                getMapDataList(vm.pagination.pageNo - 1, vm.pagination.pageSize, vm.typeRes.data[vm.typeRes.id].name);
            };

            $scope.preview = function (data) {
                console.log(data);
                $rootScope.$broadcast('mask:show', {
                    showMask: true,
                    template: '<map-panel></map-panel>',
                    overlay: {
                        title: data.Name,
                        docId: data.Id,
                        userId: data.UserId,
                        name: data.Name
                    }
                })
            };

            $scope.add = function (data) {
                // Todo: 添加数据
            };

            getMapDataList(vm.pagination.pageNo - 1, vm.pagination.pageSize, vm.typeRes.data[vm.typeRes.id].name, 1);

            function getMapDataList(pageNo, pageSize, typeRes, userId, dataId, name, gdbPath, srcID) {
                Data.getMapDataList({
                    dataId: dataId,
                    name: name,
                    userId: vm.typeRes.id ? '' : userId,
                    gdbPath: gdbPath,
                    typeRes: typeRes || 'public',
                    srcID: srcID,
                    pageNo: pageNo,
                    pageNum: pageSize
                }).then(function (res) {
                    if (res.status === 200) {
                        console.log(res.data);
                        vm.data = res.data.result;
                        vm.pagination.totalItems = res.data.count;
                        vm.pagination.maxPage = Math.ceil(res.data.count / vm.pagination.pageSize);
                    }
                });
            }
        }
        ])
})(angular);