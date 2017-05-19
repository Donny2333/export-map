/**
 * Created by Donny on 17/4/26.
 */
(function (angular) {
    "use strict";

    var prodURL = 'https://**.***.com/',
        devURL = 'http://192.168.99.61:9526/',
        Urls = {
            Prod_Cfg: {
                api: prodURL,
                img: prodURL
            },
            Dev_Cfg: {
                api: devURL,
                img: 'http://192.168.99.105:9528/'
            }
        };

    angular.module('export-map.config', [])

        .constant('URL_CFG', Urls.Dev_Cfg)

        .constant('APP_VERSION', {
            DEV: '1.0.0',
            RELEASE: '1.0.0'
        })

})(angular);