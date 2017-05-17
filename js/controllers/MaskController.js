/**
 * Created by Donny on 17/5/17.
 */
(function (angular) {
    'use strict';

    angular.module('export-map.controllers')
        .controller('MaskController', ['$scope', '$rootScope', function ($scope, $rootScope) {
            $scope.vm = {
                title: '',
                showMask: false,
                overlay: {
                    template: 'tpls/mask/overlay.html',
                    data: null
                }
            };

            $scope.closeMask = function () {
                $scope.vm.showMask = false;
            };

            $scope.pageChanged = $scope.vm.pageChanged;

            /**
             * 监听"显示mask"事件
             */
            $rootScope.$on('mask:show', function (event, value) {
                if (value.showMask) {
                    $scope.vm = {
                        title: value.title,
                        showMask: true,
                        overlay: {
                            template: value.overlay.template ? 'tpls/mask/' + value.overlay.template + '.html' : $scope.vm.overlay.template,
                            data: value.overlay.data
                        },
                        pagination: value.pagination,
                        pageChanged: value.pageChanged
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