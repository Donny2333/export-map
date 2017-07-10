/**
 * Created by Donny on 17/7/3.
 */
describe('App unit tests : ', function () {

    // Define global references for injections.
    var $state, $controller, $rootScope;
    var state = 'app.explorer.files';
    var $app;
    var $files;

    beforeEach(module('export-map'));

    beforeEach(inject(function (_$state_, _$controller_, _$rootScope_, _$httpBackend_) {
        $state = _$state_;
        $controller = _$controller_;
        $rootScope = _$rootScope_;

        $app = $rootScope.$new();
        $files = $rootScope.$new();

        var AppController = $controller('AppController', {$scope: $app});
        var FilesController = $controller('FilesController', {$scope: $files});
    }));

    describe('open doc', function () {
        it('should locate to files page', function () {
            expect($state.href(state)).toEqual('#!/app/explorer/files');
        });
    });
});