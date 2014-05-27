'use strict';

angular.module('moneyApp')
  .controller('LoginCtrl', function ($scope, $http, $location) {

    //$scope.data = {email: 'jhkim@ecplaza.net', password: '222'};

    // 로그인
    $scope.login = function($data) {
      var data = $scope.data;
     // console.log('login() start... data='+JSON.stringify(data));
      $http.post('/api/v1/users-login', data).success(function(result) {
          //console.log("login() result="+JSON.stringify(result));
          if (result.status == "fail") {
            data.msg = result.msg;
          } else {
            $location.path('/');
          }
      });
    };
  })
  .controller('LogoutCtrl', function ($scope, $http, $location, $cookies) {
    //console.log('logout() start... $cookies='+$cookies.auth);
    var id = $cookies.auth;
    $http.get('/api/v1/users-logout/'+id).success(function(result) {
        //console.log("logout() result="+JSON.stringify(result));
        if (result.status == "fail") {
          data.msg = result.msg;
        } else {
          $location.path('/api/users-login');
        }
    });
  });
