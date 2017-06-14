/**
 * Created by Donny on 17/5/19.
 */
(function (angular) {
    'use strict';

    angular.module('export-map.controllers')
        .controller('UniquePanelController', ['$scope', function ($scope) {
            var vm = $scope.vm;

            vm.overlay = {
                title: 'Unique',
                table: {},
                data: [{
                    Symbol: '',
                    Value: '&#60all other values&#62',
                    Label: '&#60all other values&#62',
                    Count: '0'
                }, {
                    Symbol: '',
                    Value: '&#60Heading&#62',
                    Label: 'Value',
                    Count: '10'
                }, {
                    Symbol: '',
                    Value: '80',
                    Label: '80',
                    Count: '2'
                }, {
                    Symbol: '',
                    Value: '100',
                    Label: '100',
                    Count: '2'
                }, {
                    Symbol: '',
                    Value: '120',
                    Label: '120',
                    Count: '2'
                }, {
                    Symbol: '',
                    Value: '140',
                    Label: '140',
                    Count: '1'
                }, {
                    Symbol: '',
                    Value: '150',
                    Label: '150',
                    Count: '1'
                }, {
                    Symbol: '',
                    Value: '160',
                    Label: '160',
                    Count: '2'
                }],
                columns: [{
                    checkbox: true,
                    align: 'center',
                    valign: 'middle'
                }, {
                    field: 'Symbol',
                    title: 'Symbol',
                    align: 'center',
                    valign: 'middle',
                    width: '100px',
                    clickToSelect: false,
                    formatter: function (value) {
                        return '<img ng-src="' + value + '" height="20" width="20">';
                    },
                    events: {
                        'click img': function (e, value, row, index) {
                            // Todo: open symbol panel
                            console.log('open symbol panel');
                        }
                    }
                }, {
                    field: 'Value',
                    title: 'Value',
                    align: 'center',
                    valign: 'middle'
                }, {
                    field: 'Label',
                    title: 'Label',
                    align: 'center',
                    valign: 'middle'
                }]
            };

            $scope.commit = function () {

            }
        }])
})(angular);