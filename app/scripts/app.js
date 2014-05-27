'use strict';

angular.module('moneyApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngTable'

])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main',
        controller: 'MainCtrl'
      })
      .when('/api/users-login', {
        templateUrl: 'partials/login',
        controller: 'UserCtrl'
      })
      .when('/api/users-welcome', {
        templateUrl: 'partials/welcome',
        controller: 'UserCtrl'
      })
/*
      .when('/api/users-logout', {
        templateUrl: '/',
        controller: 'UserCtrl'
      })
      */
      .otherwise({
        redirectTo: '/'
      });
      
    $locationProvider.html5Mode(true);
  });