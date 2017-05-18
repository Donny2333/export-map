/**
 * Created by Donny on 17/5/18.
 */
(function (angular) {
    'use strict';

    angular.module('export-map.controllers')
        .controller('SymbolPanelController', ['$scope', 'Symbol', function ($scope, Symbol) {
            var vm = $scope.vm;

            $scope.pageChanged = function () {
                getSymbolItemListFromDB(vm.overlay.vm.styleId, vm.overlay.vm.pagination.pageNo - 1, vm.overlay.vm.pagination.pageSize)
            };

            function getSymbolItemListFromDB(styleId, pageNo, pageSize) {
                Symbol.getSymbolItemListFromDB({
                    styleId: styleId,
                    pageNo: pageNo,
                    pageSize: pageSize
                }).then(function (res) {
                    if (res.status === 200) {
                        console.log(res.data);
                        vm.overlay.vm.data = res.data.result;
                        vm.overlay.vm.pagination.totalItems = res.data.count;
                        vm.overlay.vm.pagination.maxPage = Math.ceil(res.data.count / vm.overlay.vm.pagination.pageSize);
                    }
                })
            }
        }])
})(angular);