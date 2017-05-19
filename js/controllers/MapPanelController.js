/**
 * Created by Donny on 17/5/18.
 */
(function (angular) {
    'use strict';

    angular.module('export-map.controllers')
        .controller('MapPanelController', ['$scope', 'URL_CFG', function ($scope, URL_CFG) {
            var vm = $scope.vm;
            var extent = [12349186.0111133, 3765310.49379061, 12541939.221565, 3874205.11961953];
            var map = new ol.Map({
                controls: ol.control.defaults().extend([
                    new ol.control.ScaleLine()
                ]),
                layers: [new ol.layer.Image()],
                target: 'panel-map',
                view: new ol.View({
                    center: [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2],
                    // zoom: 15,
                    extent: extent,
                    resolution: 96,
                    projection: 'EPSG:3857'
                })
            });


            initMap(URL_CFG.api + 'MapService.svc/Export');


            function initMap(url) {
                map.getLayers().item(0).setSource(new ol.source.ImageWMS({
                    url: url,
                    attributions: '© <a href="http://www.dx-tech.com/">HGT</a>',
                    imageExtent: map.getView().calculateExtent(),
                    params: {
                        docId: vm.overlay.docId,
                        userId: vm.overlay.userId,
                        name: vm.overlay.name,
                        typeMapDoc: vm.overlay.typeMapDoc,
                        typeResouce: vm.overlay.typeResouce
                    }
                }));
            }
        }])
})(angular);