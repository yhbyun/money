'use strict';

angular.module('moneyApp')
  .controller('NavbarCtrl', function ($scope, $location, $cookies) {
    //console.log('[NavbarCtrl] $cookies.auth='+$cookies.auth);
    var auth = $cookies.auth;
    if (auth == undefined) {
      $scope.menu = [{
        'title': 'Home',
        'link': '/'
      },
      {
        'title': 'Sign in',
        'link': '/api/users-login'
      }];
    } else {
      $scope.menu = [{
        'title': 'Home',
        'link': '/'
      },
      {
        'title': '가계부 리스트',
        'link': '/moneybooks'
      },
      {
        'title': '월별 리스트',
        'link': '/state-months'
      },
      {
        'title': 'Logout',
        'link': '/api/users-logout'
      }];
    }
    
    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
