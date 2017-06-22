/**
 * Created by Donny on 17/6/22.
 */
(function (angular) {
    'use strict';

    angular.module('export-map.controllers')
        .controller('QueryPanelController', ['$scope', '$rootScope', function ($scope, $rootScope) {
            var vm = $scope.vm;

            $scope.commit = function () {
                $scope.closeMask();
                $rootScope.$broadcast('map:toggleTable', {
                    table: {
                        head: 'table head',
                        data: [
                            {
                                id: 0,
                                name: 'Tom',
                                sex: 'Female',
                                birthday: '1990-10-12',
                                tel: '123456'
                            }, {
                                id: 1,
                                name: 'Marry',
                                sex: 'Female',
                                birthday: '1991-08-22',
                                tel: '123456'
                            }, {
                                id: 2,
                                name: 'Tom',
                                sex: 'Male',
                                birthday: '1992-01-05',
                                tel: '123456'
                            }, {
                                id: 3,
                                name: 'Jerry',
                                sex: 'Male',
                                birthday: '1989-07-01',
                                tel: '123456'
                            }, {
                                id: 4,
                                name: 'Rose',
                                sex: 'Female',
                                birthday: '1992-11-12',
                                tel: '123456'
                            }, {
                                id: 5,
                                name: 'Jack',
                                sex: 'Female',
                                birthday: '1995-10-07',
                                tel: '123456'
                            }, {
                                id: 6,
                                name: 'Tom',
                                sex: 'Female',
                                birthday: '1990-10-12',
                                tel: '123456'
                            }, {
                                id: 7,
                                name: 'Marry',
                                sex: 'Female',
                                birthday: '1991-08-22',
                                tel: '123456'
                            }, {
                                id: 8,
                                name: 'Tom',
                                sex: 'Male',
                                birthday: '1992-01-05',
                                tel: '123456'
                            }, {
                                id: 9,
                                name: 'Jerry',
                                sex: 'Male',
                                birthday: '1989-07-01',
                                tel: '123456'
                            }, {
                                id: 10,
                                name: 'Rose',
                                sex: 'Female',
                                birthday: '1992-11-12',
                                tel: '123456'
                            }, {
                                id: 11,
                                name: 'Jack',
                                sex: 'Female',
                                birthday: '1995-10-07',
                                tel: '123456'
                            }]
                    }
                });
            };
        }])
})(angular);