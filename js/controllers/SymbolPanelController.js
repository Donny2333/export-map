/**
 * Created by Donny on 17/5/18.
 */
(function (angular) {
    'use strict';

    angular.module('export-map.controllers')
        .controller('SymbolPanelController', ['$scope', 'Symbol', function ($scope, Symbol) {
            var vm = $scope.vm;
            vm.select = vm.overlay.data[0];

            $scope.pageChanged = function () {
                getSymbolItemListFromDB(vm.overlay.styleId, vm.overlay.pagination.pageNo - 1, vm.overlay.pagination.pageSize)
            };

            $scope.change = function (type) {
                if (type === 0) {
                    if (vm.select.PointColor.indexOf("rgb") >= 0) {
                        vm.select.PointColor = vm.select.PointColor.substr(4, vm.select.PointColor.length - 5);
                    }
                }
                if (type === 1) {
                    if (vm.select.LineColor.indexOf("rgb") >= 0) {
                        vm.select.LineColor = vm.select.LineColor.substr(4, vm.select.LineColor.length - 5);
                    }
                }
                if (type === 2) {
                    if (vm.select.FillColor.indexOf("rgb") >= 0) {
                        vm.select.FillColor = vm.select.FillColor.substr(4, vm.select.FillColor.length - 5);
                    }
                }
            };

            $scope.preview = function (colorObject) {
                var param = _.merge(_.pick(vm.select, [
                    'StylePath',
                    'SymbolType',
                    'SymbolName',
                    'PointColor',
                    'PointSize',
                    'PointAngle',
                    'LineColor',
                    'LineWidth',
                    'FillColor'
                ]), {
                    height: 50,
                    width: 50
                });
                Symbol.getSymbolPreview(param).then(function (res) {
                    if (res.status === 200) {
                        console.log(res.data);
                        vm.select.Preview = res.data.result;
                    }
                })
            };

            function getSymbolItemListFromDB(styleId, pageNo, pageSize) {
                Symbol.getSymbolItemListFromDB({
                    styleId: styleId,
                    pageNo: pageNo,
                    pageSize: pageSize
                }).then(function (res) {
                    if (res.status === 200) {
                        vm.overlay.data = res.data.result;
                        vm.overlay.pagination.totalItems = res.data.count;
                        vm.overlay.pagination.maxPage = Math.ceil(res.data.count / vm.overlay.pagination.pageSize);
                        vm.select = vm.overlay.data[0];
                    }
                })
            }
        }])
})(angular);