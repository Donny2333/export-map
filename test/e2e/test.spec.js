describe('angularjs 首页', function () {
    it('应该欢迎一个具名的用户', function () {
        //要求浏览器访问网址http://www.angularjs.org
        browser.get('http://www.angularjs.org');

        //找到ng-model名为'youname'的HTML元素，要求浏览器键入名字
        element(by.model('yourName')).sendKeys('tanshuai');

        var greeting = element(by.binding('yourName'));

        //取得结果并作断言测试
        expect(greeting.getText()).toEqual('Hello tanshuai!');
    });

    describe('待办事项', function () {
        var todoList;

        beforeEach(function () {
            browser.get('http://www.angularjs.org');

            todoList = element.all(by.repeater('todo in todoList.todos'));
        });

        it('应该列出待办事项列表', function () {
            expect(todoList.count()).toEqual(2);
            expect(todoList.get(1).getText()).toEqual('build an AngularJS app');
        });

        it('应该添加一个待办事项', function () {
            var addTodo = element(by.model('todoList.todoText'));
            var addButton = element(by.css('[value="add"]'));

            addTodo.sendKeys('编写一个Protractor测试');
            addButton.click();

            expect(todoList.count()).toEqual(3);
            expect(todoList.get(2).getText()).toEqual('编写一个Protractor测试');
        });
    });
});