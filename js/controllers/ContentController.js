/**
 * Created by Donny on 17/5/16.
 */
(function (angular) {
    'use strict';

    angular.module('export-map.controllers')
        .controller('ContentController', ['$scope', function ($scope) {
            console.log($scope.$parent.vm);

            $scope.expandLayer = function (layer) {
                console.log(layer);
            };

            $scope.hideLayer = function (layer) {
                console.log(layer);
            };

            function expand() {

            }

            function hide() {

            }
        }])
})(angular);