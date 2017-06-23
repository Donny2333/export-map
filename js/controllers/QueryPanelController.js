/**
 * Created by Donny on 17/6/22.
 */
(function (angular) {
    'use strict';

    angular.module('export-map.controllers')
        .controller('QueryPanelController', ['$scope', '$rootScope', function ($scope, $rootScope) {
            var vm = $scope.vm;
            vm.overlay.field = {
                select: 0,
                data: [{
                    id: 0,
                    value: 'name'
                }, {
                    id: 1,
                    value: 'sex'
                }, {
                    id: 2,
                    value: 'tel'
                }]
            };
            vm.overlay.operator = {
                select: 0,
                data: [{
                    id: 0,
                    value: '+'
                }, {
                    id: 1,
                    value: '-'
                }, {
                    id: 2,
                    value: '*'
                }, {
                    id: 3,
                    value: '/'
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

            $scope.add = function () {
                vm.overlay.query.push([
                    vm.overlay.field.data[vm.overlay.field.select].value,
                    vm.overlay.operator.data[vm.overlay.operator.select].value,
                    vm.overlay.param.data[vm.overlay.param.select].value
                ].join(' '));
                console.log(vm.overlay.query);
            };

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