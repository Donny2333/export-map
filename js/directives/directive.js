/**
 * Created by Donny on 17/3/22.
 */
(function (angular) {
    'use strict';

    angular.module('export-map.directives', [])
        .directive('myChart', function () {
            return {
                restrict: 'E',
                template: '<div ng-style="userStyle"></div>',
                replace: true,
                scope: {
                    data: '=',
                    userStyle: '='
                },
                link: function (scope, element, attrs) {
                    // 基于准备好的dom，初始化echarts实例
                    var myChat = echarts.init(element[0]);

                    // 使用刚指定的配置项和数据显示图表
                    myChat.setOption(scope.data);

                    //监听DOM元素
                    scope.$watch('data', function (value) {
                        if (value.series) {
                            // console.log(value);
                            myChat.setOption(scope.data);
                        }
                    });

                    scope.$watch('userStyle', function (value) {
                        if (value) {
                            // console.log(value);
                            myChat.resize();
                        }
                    })
                }
            };
        })

        .directive('zTree', ['$parse', function ($parse) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    var treeObj = undefined;
                    var setting = $parse(attrs.setting)(scope);
                    var zNodes = $parse(attrs.zNodes)(scope);

                    treeObj = $.fn.zTree.init(element, setting, zNodes);

                    scope.$watch(function () {
                        return $parse(attrs.zNodes)(scope);
                    }, function (value) {
                        if (value) {
                            treeObj = $.fn.zTree.init(element, setting, value);
                        }
                    });
                }
            }
        }])

        .directive('mask', function () {
            return {
                restrict: 'E',
                templateUrl: './tpls/mask/mask.html',
                controller: 'MaskController'
            }
        })

})(angular);