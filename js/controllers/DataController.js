/**
 * Created by Donny on 17/5/16.
 */
(function (angular) {
    'use strict';

    angular.module('export-map.controllers')
        .controller('DataController', ['$scope', '$rootScope', '$uibModal', 'Data', 'Doc', function ($scope, $rootScope, $uibModal, Data, Doc) {
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
                if ($scope.$parent.vm.doc && $scope.$parent.vm.doc.docId) {
                    if (vm.typeRes.id) {
                        // 添加公共数据
                        console.log(data);
                        var newLayer = {
                            userId: $scope.$parent.vm.doc.userId,
                            orgPath: data.GdbPath,
                            orgNames: data.Name,
                            userPath: $scope.$parent.vm.gdbs[0].gdbPath,
                            desNames: data.Name
                        };

                        var modalInstance = $uibModal.open({
                            ariaLabelledBy: 'modal-title',
                            ariaDescribedBy: 'modal-body',
                            templateUrl: 'myModalContent.html',
                            controller: 'ModalInstanceCtrl',
                            resolve: {
                                newLayer: newLayer
                            }
                        });

                        modalInstance.result.then(function (newLayer) {
                            console.log(newLayer);
                            if (newLayer.id) {
                                addLayer($scope.$parent.vm.doc.docId, $scope.$parent.vm.doc.userId, $scope.$parent.vm.doc.name, newLayer.id);
                            }
                        }, function () {
                            console.info('Modal dismissed at: ' + new Date());
                        });
                    } else {
                        // 添加用户数据
                        addLayer($scope.$parent.vm.doc.docId, $scope.$parent.vm.doc.userId, $scope.$parent.vm.doc.name, data.Id);
                    }
                } else {
                    // Todo: 显示"无打开文档"弹出窗口
                    console.log('no doc');
                }
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

            function addLayer(docId, userId, name, dataId) {
                Doc.addLayerToMap({
                    docId: docId,
                    userId: userId,
                    name: name,
                    dataId: dataId
                }).then(function (res) {
                    if (res.status === 200) {
                        console.log(res.data);
                        $scope.$emit('layer:change', res.data);
                    }
                })
            }
        }])

        .controller('ModalInstanceCtrl', ['$uibModalInstance', '$scope', 'newLayer', 'Data',
            function ($uibModalInstance, $scope, newLayer, Data) {
                var vm = $scope.vm = {
                    newLayer: newLayer,
                    error: false,
                    errorMsg: ''
                };

                console.log(newLayer);

                $scope.ok = function () {
                    if (!vm.newLayer.orgNames.length) {
                        vm.error = true;
                        vm.errorMsg = '名称不能为空！';
                    } else {
                        return Data.importDataFromPublic({
                            userId: vm.newLayer.userId,
                            orgPath: vm.newLayer.orgPath,
                            orgNames: vm.newLayer.orgNames,
                            userPath: vm.newLayer.userPath,
                            desNames: vm.newLayer.desNames
                        }).then(function (res) {
                            if (res.data.status === 'error') {
                                vm.error = true;
                                vm.errorMsg = res.data.msg;
                            } else if (res.data.status === 'ok') {
                                vm.newLayer.id = res.data.result[0].Id;
                                console.log(res.data.result[0]);
                                $uibModalInstance.close(vm.newLayer);
                                vm.error = false;
                            }
                        });
                    }
                };

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                    vm.error = false;
                };
            }]);
})(angular);