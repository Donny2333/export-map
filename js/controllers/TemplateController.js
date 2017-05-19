/**
 * Created by Donny on 17/5/16.
 */
(function (angular) {
    'use strict';

    angular.module('export-map.controllers')
        .controller('TemplateController', ['$scope', '$rootScope', 'Doc', 'URL_CFG', function ($scope, $rootScope, Doc, URL_CFG) {
            var vm = $scope.vm = {
                templates: [],
                pagination: {
                    totalItems: 0,
                    maxSize: 5,
                    pageNo: 1,
                    pageSize: 10,
                    maxPage: 1
                }
            };

            $scope.pageChanged = function () {
                getTemplates(vm.pagination.pageNo - 1, vm.pagination.pageSize, "模板", "Public", "Templete");
            };

            $scope.preview = function (data) {
                console.log(data);
                $rootScope.$broadcast('mask:show', {
                    showMask: true,
                    template: '<map-panel></map-panel>',
                    overlay: {
                        title: data.title,
                        docId: data.id,
                        userId: 0,
                        name: data.title,
                        typeMapDoc: 'Templete',
                        typeResouce: 'Public'
                    }
                })
            };

            getTemplates(vm.pagination.pageNo - 1, vm.pagination.pageSize, "模板", "Public", "Templete");

            function getTemplates(pageNo, pageSize, tagName, typeRes, mapType) {
                Doc.list({
                    // userId: 1,
                    pageNo: pageNo,
                    pageNum: pageSize,
                    tagName: tagName || "",
                    typeRes: typeRes || "Public",
                    mapType: mapType || "MapServer"
                }).then(function (res) {
                    if (res.data.status === "ok" && res.data.result) {
                        vm.templates = [];
                        res.data.result.length > 0 && res.data.result.map(function (template) {
                            vm.templates.push({
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
                        console.log(vm.templates);
                        vm.pagination.totalItems = res.data.count;
                        vm.pagination.maxPage = Math.ceil(res.data.count / vm.pagination.pageSize);
                    }
                    else {
                        console.log(res.data);
                    }
                });
            }
        }])
})(angular);