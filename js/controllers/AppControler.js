/**
 * Created by Donny on 17/3/22.
 */
(function (angular) {
    'use strict';

    angular.module('export-map.controllers', [])
        .controller('AppController', ['$scope', '$state', 'Router', function ($scope, $state, Router) {
            var vm = $scope.vm = {
                menus: Router.list()
            };

            $scope.go = function ($event, menu) {
                $event.preventDefault();
                $state.go([menu.sref, menu.sub].join('.'));
            };
        }])
})(angular);