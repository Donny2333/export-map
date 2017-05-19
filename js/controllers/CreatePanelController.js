/**
 * Created by Donny on 17/5/18.
 */
(function (angular) {
    'use strict';

    angular.module('export-map.controllers')
        .controller('CreatePanelController', ['$scope', '$rootScope', 'Doc', 'URL_CFG', function ($scope, $rootScope, Doc, URL_CFG) {
            var vm = $scope.vm;

            $scope.pageChanged = function () {
                getDocs(vm.overlay.pagination.pageNo - 1, vm.overlay.pagination.pageSize, "模板", "Public", "Templete");
            };

            $scope.select = function (id) {
                vm.overlay.choose = false;
                vm.overlay.create = true;
                vm.overlay.doc.docId = id;
                console.log(id);
            };

            $scope.goBack = function () {
                vm.overlay.choose = true;
                vm.overlay.create = false;
            };

            $scope.create = function () {
                Doc.create(vm.overlay.doc).then(function (res) {
                    console.log(res.data);
                    var value = res.data.result;
                    vm.overlay.create = false;
                    vm.showMask = false;
                    $rootScope.$broadcast('doc:change');
                    $rootScope.$broadcast('doc:open', {
                        docId: value.Id,
                        userId: value.UserId,
                        name: value.Name,
                        name2: value.Name2,
                        author: value.Author,
                        detail: value.Detail,
                        detail2: value.Detail2,
                        tagName: value.TagName
                    });
                    layer.msg('地图创建成功', {icon: 1});
                });
            };

            function getDocs(pageNo, pageSize, tagName, typeRes, mapType) {
                Doc.list({
                    // userId: 1,
                    pageNo: pageNo,
                    pageNum: pageSize,
                    tagName: tagName || "",
                    typeRes: typeRes || "Public",
                    mapType: mapType || "MapServer"
                }).then(function (res) {
                    if (res.data.status === "ok" && res.data.result) {
                        vm.overlay.templates = [];
                        res.data.result.length > 0 && res.data.result.map(function (template) {
                            vm.overlay.templates.push({
                                id: template.Id,
                                title: template.Name,
                                author: template.Author,
                                update: template.UpdateTime.split(' ')[0],
                                version: "1.0.0",
                                img: URL_CFG.img + _.replace(template.PicPath, '{$}', 'big'),
                                brief: template.Detail,
                                detail: template.Detail2
                            })
                        });
                        // console.log(vm.overlay.templates);
                        vm.overlay.pagination.totalItems = res.data.count;
                        vm.overlay.pagination.maxPage = Math.ceil(res.data.count / vm.overlay.pagination.pageSize);
                    }
                    else {
                        console.log(res.data);
                    }
                });
            }

            Doc.getTypes({
                typeRes: "Public",
                fieldName: "TagName",
                mapType: "mapserver"
            }).then(function (res) {
                if (res.data.status === "ok") {
                    vm.overlay.dropdown = res.data.result;
                }
            });
        }])
})(angular);