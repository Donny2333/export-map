/**
 * Created by Donny on 17/5/16.
 */
(function (angular) {
    'use strict';

    angular.module('export-map.controllers')

    .controller('FilesController', ['$scope', 'Doc',function ($scope, Doc) {
        $scope.directive('tree', function () {
            return {
                require: '?ngModel',
                restrict: 'A',
                link: function ($scope, element, attrs, ngModel) {
                    //var opts = angular.extend({}, $scope.$eval(attrs.nlUploadify));
                    var setting = {
                        view: {
                            showLine: false,
                            showIcon: false,
                            selectedMulti: false,
                            dblClickExpand: false,
                            addDiyDom: addDiyDom
                        },
                        data: {
                            key: {
                                title: "t"
                            },
                            simpleData: {
                                enable: true
                            }
                        },
                        callback: {
                            onClick: function (event, treeId, treeNode, clickFlag) {
                                $scope.$apply(function () {
                                    ngModel.$setViewValue(treeNode);
                                });
                            }
                        }
                    };

                    var zNodes = [
                        { id: 1, pId: 0, name: "普通的父节点", t: "我很普通，随便点我吧", open: true },
                        { id: 11, pId: 1, name: "叶子节点 - 1", t: "我很普通，随便点我吧" },
                        { id: 12, pId: 1, name: "叶子节点 - 2", t: "我很普通，随便点我吧" },
                        { id: 13, pId: 1, name: "叶子节点 - 3", t: "我很普通，随便点我吧" },
                        { id: 2, pId: 0, name: "NB的父节点", t: "点我可以，但是不能点我的子节点，有本事点一个你试试看？", open: true },
                        { id: 21, pId: 2, name: "叶子节点2 - 1", t: "你哪个单位的？敢随便点我？小心点儿..", click: false },
                        { id: 22, pId: 2, name: "叶子节点2 - 2", t: "我有老爸罩着呢，点击我的小心点儿..", click: false },
                        { id: 23, pId: 2, name: "叶子节点2 - 3", t: "好歹我也是个领导，别普通群众就来点击我..", click: false },
                        { id: 3, pId: 0, name: "郁闷的父节点", t: "别点我，我好害怕...我的子节点随便点吧...", open: true, click: false },
                        { id: 31, pId: 3, name: "叶子节点3 - 1", t: "唉，随便点我吧" },
                        { id: 32, pId: 3, name: "叶子节点3 - 2", t: "唉，随便点我吧" },
                        { id: 33, pId: 3, name: "叶子节点3 - 3", t: "唉，随便点我吧" }
                    ];
                    $.fn.zTree.init(element, setting, zNodes);
                }
            };
        })
        getMapList(vm.pagination.pageNo - 1, vm.pagination.pageSize, vm.typeRes.data[vm.typeRes.id].name, 1);

        function getMapList(pageNo, pageSize, typeRes, userId, dataId, name, gdbPath, srcID) {
            Doc.list({
                dataId: dataId,
                name: name,
                userId: vm.typeRes.id ? '' : userId,
                gdbPath: gdbPath,
                typeRes: typeRes || 'public',
                srcID: srcID,
                pageNo: pageNo,
                pageNum: pageSize
            }).then(function (res) {
                if (res.status === 200) {
                    console.log(res.data);
                    vm.data = res.data.result;
                    vm.pagination.totalItems = res.data.count;
                    vm.pagination.maxPage = Math.ceil(res.data.count / vm.pagination.pageSize);
                }
            });
        }

    }])
})(angular);