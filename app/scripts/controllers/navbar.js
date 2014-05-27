'use strict';

angular.module('moneyApp')
  .controller('NavbarCtrl', function ($scope, $location) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    },
    {
      'title': 'Sign in',
      'link': '/api/users-login'
    },
    {
      'title': 'Logout',
      'link': '/api/users-logout'
    }];
    
    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
