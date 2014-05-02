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
    $httpBackend.expectGET('/api/v1/moneybooks')
      .respond(['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express']);
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of moneybooks data to the scope', function () {
    console.log('[main] data....'+JSON.stringify(scope.moneyBooks));
    expect(scope.moneyBooks.$params.page).toBe(1);
    expect(scope.moneyBooks.$params.count).toBe(10);
  });

  it('should have a properly working MainCtrl controller', inject(function($rootScope, $controller, $httpBackend) {
    var searchTestAtr = 'cars';
    var response = $httpBackend.expectJSONP('/api/v1/moneybooks?q=' + searchTestAtr);
    response.respond(null);

    var $scope = $rootScope.$new();
    var ctrl = $controller('MainCtrl', {
      $scope : $scope,
      $routeParams : {
        q : searchTestAtr
      }
    });
  }));

  it('should have a properly working MainCtrl controller', inject(function($rootScope, $controller, $httpBackend) {
    var searchID = '1';
    var response = $httpBackend.expectJSONP('/api/v1/moneybooks/' + searchID);
    response.respond(null);

    var $scope = $rootScope.$new();
    var ctrl = $controller('MainCtrl', {
      $scope : $scope,
      $routeParams : {
        id : searchID
      }
    });
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
