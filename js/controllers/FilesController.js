/**
 * Created by Donny on 17/5/16.
 */
(function (angular) {
    'use strict';

    angular.module('export-map.controllers')

        .controller('FilesController', ['$scope','$rootScope', 'Doc','URL_CFG', function ($scope,$rootScope,Doc, URL_CFG) {
            var vm = $scope.vm = {
                mapDoc: [],
                // setting: {
                //     view: {
                //         showLine: false,
                //         showIcon: false,
                //         selectedMulti: false,
                //         dblClickExpand: false,
                //         // addDiyDom: addDiyDom
                //     },
                //     data: {
                //         key: {
                //             title: "name"
                //         },
                //         simpleData: {
                //             enable: true
                //         }
                //     },
                //     callback: {
                //         onClick: function (event, treeId, treeNode, clickFlag) {
                //             $scope.$apply(function () {
                //                 ngModel.$setViewValue(treeNode);
                //             });
                //         }
                //     }
                // },
                typeRes: {
                    id: 1,
                    data: [{
                        id: 0,
                        name: 'Users',
                        text: '用户数据'
                    }, {
                        id: 1,
                        name: 'Public',
                        text: '公共数据'
                    }]
                },
                pagination: {
                    totalItems: 0,
                    maxSize: 5,
                    pageNo: 1,
                    pageSize: 10,
                    maxPage: 1
                },
                // list: [
                //     { id: 1, pId: 0, name: "普通的父节点", t: "我很普通，随便点我吧", open: true },
                //     { id: 11, pId: 1, name: "叶子节点 - 1", t: "我很普通，随便点我吧" },
                //     { id: 12, pId: 1, name: "叶子节点 - 2", t: "我很普通，随便点我吧" },
                //     { id: 13, pId: 1, name: "叶子节点 - 3", t: "我很普通，随便点我吧" },
                //     { id: 2, pId: 0, name: "NB的父节点", t: "点我可以，但是不能点我的子节点，有本事点一个你试试看？", open: true },
                //     { id: 21, pId: 2, name: "叶子节点2 - 1", t: "你哪个单位的？敢随便点我？小心点儿..", click: false },
                //     { id: 22, pId: 2, name: "叶子节点2 - 2", t: "我有老爸罩着呢，点击我的小心点儿..", click: false },
                //     { id: 23, pId: 2, name: "叶子节点2 - 3", t: "好歹我也是个领导，别普通群众就来点击我..", click: false },
                //     { id: 3, pId: 0, name: "郁闷的父节点", t: "别点我，我好害怕...我的子节点随便点吧...", open: true, click: false },
                //     { id: 31, pId: 3, name: "叶子节点3 - 1", t: "唉，随便点我吧" },
                //     { id: 32, pId: 3, name: "叶子节点3 - 2", t: "唉，随便点我吧" },
                //     { id: 33, pId: 3, name: "叶子节点3 - 3", t: "唉，随便点我吧" }
                // ]
            };

            $scope.pageChanged = function () {
                getMapList(vm.pagination.pageNo - 1, vm.pagination.pageSize, "", "Public", "");
            };
            $scope.preview = function (mapdoc) {
                console.log(22)
                // Todo: 查看数据
                // $scope.$emit('doc:open', {
                //     docId: 44,
                //     userId: 1,
                //     name: '老河口测试地图',
                //     name2: '来自前端的老河口测试地图',
                //     author: '姚志武',
                //     detail: '老河口测试地图，老河口测试地图',
                //     detail2: '老河口测试地图，老河口测试地图，老河口测试地图',
                //     tagName: '城管'
                // });
                $scope.$emit('doc:open', {
                    docId: mapdoc.id,
                    userId: mapdoc.userId,
                    name: mapdoc.title,
                    name2: mapdoc.name2,
                    author: mapdoc.author,
                    detail: mapdoc.brief,
                    detail2: mapdoc.detail,
                    tagName: mapdoc.tagName,
                    xmin: mapdoc.xmin,
                    ymin:mapdoc.ymin,
                    xmax:mapdoc.xmax,
                    ymax:mapdoc.ymax,
                    srcID:mapdoc.srcID,
                    srcName:mapdoc.srcName,
                    minScale:mapdoc.minScale,
                    maxScale:mapdoc.maxScale,
                    mapType:mapdoc.mapType,
                    mapServerPath:mapdoc.mapServerPath,
                    mxdPath:mapdoc.mxdPath
                });
            };
            $scope.deleteMap = function (mapdoc) {
                layer.confirm('您确定要删除该地图文档？', {
                    btn: ['确定','取消'] //按钮
                }, function(){
                    console.log("1212");
                    Doc.remove({
                        docId: mapdoc.id,
                        userId: mapdoc.userId,
                        name: mapdoc.title,
                    }).then(function (res) {
                        console.log("tttt");
                        if (res.data.status === "ok") {
                            layer.msg('地图删除成功', {icon: 1});
                            getMapList(vm.pagination.pageNo - 1, vm.pagination.pageSize, "", "Users", "");
                        }
                        else {
                            layer.msg('地图删除失败', {icon: 1});
                        }
                })}, function(){
                    layer.close()
                });
            }

            getMapList(vm.pagination.pageNo - 1, vm.pagination.pageSize, "", "Users", "");

            function getMapList(pageNo, pageSize, tagName, typeRes, mapType) {
                Doc.list({
                    userId: 1,
                    pageNo: pageNo,
                    pageNum: pageSize,
                    tagName: tagName || "",
                    typeRes: typeRes || "Public",
                    //mapType: mapType || "MapServer"
                }).then(function (res) {
                    if (res.data.status === "ok" && res.data.result) {
                        vm.mapDoc = [];
                        res.data.result.length > 0 && res.data.result.map(function (mapDoc) {
                            vm.mapDoc.push({
                                id: mapDoc.Id,
                                title: mapDoc.Name,
                                userId: mapDoc.UserId,
                                name2:mapDoc.Name2,
                                img: URL_CFG.img + _.replace(mapDoc.PicPath, '{$}', 'big'),
                                author: mapDoc.Author,
                                update: mapDoc.UpdateTime.split(' ')[0],
                                brief: mapDoc.Detail,
                                detail: mapDoc.Detail2,
                                tagName:mapDoc.TagName,
                                srcID:mapDoc.SrcID,
                                srcName:mapDoc.SrcName,
                                xmin:mapDoc.Xmin,
                                ymin:mapDoc.Ymin,
                                xmax:mapDoc.Xmax,
                                ymax:mapDoc.Ymax,
                                minScale:mapDoc.MinScale,
                                maxScale:mapDoc.MaxScale,
                                mapType:mapDoc.MapType,
                                mapServerPath:mapDoc.MapServerPath,
                                mxdPath:mapDoc.MxdPath,
                                typeRes:mapDoc.TypeRes,
                                version: "1.0.0",
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