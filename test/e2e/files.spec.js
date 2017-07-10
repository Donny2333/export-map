/**
 * Created by Donny on 17/7/4.
 */
describe('Files test', function () {
    beforeEach(function () {
        browser.get('http://192.168.99.240:3000/');
    });

    it('should add one and two', function () {
        var createOrClose = element(by.id('createOrClose'));
        createOrClose.click();
        // var tagNames = element.all(by.repeater('item in vm.overlay.dropdown'));

        element(by.model('vm.overlay.doc.name')).sendKeys("来自protractor的测试");
        // element(by.model('vm.overlay.doc.name2')).sendKeys("来自protractor的测试");
        // element(by.className('dropdown-menu')).click();
        // element(by.model('vm.overlay.doc.detail')).sendKeys("这是自动化测试，这是自动化测试");
        // element().sendKeys("这是自动化测试，这是自动化测试，这是自动化测试");
        // element(by.id('createOrClose')).click();

        expect(createOrClose.getText()).toEqual('新建地图');
    });
});