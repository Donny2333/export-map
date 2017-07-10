exports.config = {
    SeleniumAddress: 'http://localhost:4444/wd/hub',
    capabilities: {
        browserName: 'chrome'
    },
    specs: ['files.spec.js'],
    framework: 'jasmine'
};