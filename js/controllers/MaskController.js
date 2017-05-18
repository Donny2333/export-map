/**
 * Created by Donny on 17/5/17.
 */
(function (angular) {
    'use strict';

    angular.module('export-map.controllers')
        .controller('MaskController', ['$scope', '$rootScope', function ($scope, $rootScope) {
            $scope.vm = {
                showMask: false,
                overlay: {
                    template: '',
                    vm: {}
                }
            };

            $scope.closeMask = function () {
                $scope.vm.showMask = false;
            };

            /**
             * 监听"显示mask"事件
             */
            $rootScope.$on('mask:show', function (event, value) {
                if (value.showMask) {
                    $scope.vm = {
                        showMask: true,
                        overlay: {
                            template: value.overlay.template ? value.overlay.template : $scope.vm.overlay.template,
                            vm: value.overlay.vm
                        }
                    };
                }
            });

            /**
             * 监听"隐藏mask"事件
             */
            $rootScope.$on('mask:hide', function (event, value) {
                if (!value.showMask) {
                    $scope.vm.showMask = false;
                }
            });
        }])
})(angular);