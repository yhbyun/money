'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  //beforeEach(module('moneyApp'));
  beforeEach(angular.mock.module('moneyApp'));

  var MainCtrl,
    scope,
    $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/v1/moneybooks/')
      .respond({"results":{"total_count":1,"page_count":1,"page_size":"10","data":[{"item":"item to delete","amount":1200,"date":"2014-04-24"}]}});
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should have default parameters', function () {
    expect(scope.moneyBooks.$params.page).toBe(1);
    expect(scope.moneyBooks.$params.count).toBe(10);
  });

  it('should attach a list of data to the scope', inject(function($rootScope, $controller, $httpBackend) {
    scope.init();
    $httpBackend.flush();
    console.log('scope.data....'+JSON.stringify(scope.data));
    expect(scope.data.length).toBe(1);

  }));

  it('should suceed modifying moneybook', inject(function($rootScope, $controller, $httpBackend) {
    var searchID = '1';
    var data = {"id":searchID,"item":"item to modify","amount":1100,"date":"2014-05-07"};

    scope.init();
    $httpBackend.flush();

    $httpBackend.expectPUT('/api/v1/moneybooks/'+searchID, data)
      .respond(200, {"status":"ok"});

    $httpBackend.expectGET('/api/v1/moneybooks/')
      .respond({"results":{"total_count":1,"page_count":1,"page_size":"10","data":[{"item":"item to delete","amount":1200,"date":"2014-04-24"}]}});

    scope.update(data);
    $httpBackend.flush();
  }));

/*
  it('should have a MainCtrl controller', function() {
    expect(moneyApp.MainCtrl).not.to.equal(null);
  });
*/
/*
  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/awesomeThings')
      .respond(['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express']);
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings).toBeUndefined();
    $httpBackend.flush();
    expect(scope.awesomeThings.length).toBe(4);
  });
*/
});
