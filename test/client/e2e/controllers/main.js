// protractor 테스트 예제 (https://github.com/angular/protractor/blob/master/docs/getting-started.md)
/*
describe('angularjs homepage', function() {
  it('should greet the named user', function() {
    // Load the AngularJS homepage.
    browser.get('http://www.angularjs.org');

    // Find the element with ng-model matching 'yourName' - this will
    // find the <input type="text" ng-model="yourName"/> element - and then
    // type 'Julie' into it.
    element(by.model('yourName')).sendKeys('Julie');

    // Find the element with binding matching 'yourName' - this will
    // find the <h1>Hello {{yourName}}!</h1> element.
    var greeting = element(by.binding('yourName'));

    // Assert that the text element has the expected value.
    // Protractor patches 'expect' to understand promises.
    expect(greeting.getText()).toEqual('Hello Julie!');
  });
});
*/

describe('moneybooks homepage', function() {
  it('should greet the named user', function() {
    // 페이지 로드
    browser.get('/');

    // 항목 입력
    element(by.model('info.item')).sendKeys('coffee 2');

    // 금액 입력
    element(by.model('info.amount')).sendKeys('2900');

    // 날짜 입력
    element(by.model('info.date')).sendKeys('2014-05-02');

    // 엔터키 입력
    element(by.model('info.date')).sendKeys(protractor.Key.ENTER);

    // Assert that the text element has the expected value.
    // Protractor patches 'expect' to understand promises.
    //expect(greeting.getText()).toEqual('Hello Julie!');
  });
});
