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
        'title': 'Logout',
        'link': '/api/users-logout'
      }];
    }
    
    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
