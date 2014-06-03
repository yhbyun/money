'use strict';

angular.module('moneyApp')
  .controller('UserCtrl', function ($scope, $http, $location) {

  //µî·Ï
  $scope.add = function() {
    var data = $scope.user;
    //console.log('add().. data='+JSON.stringify(data));
    $http.get('/api/v1/users-email?email='+data.email+'&password='+data.password).success(function(result) {
      if (result.status == "fail") {
        //console.log(result.msg);
        data.msg = result.msg;
      } else {
        $http.post('/api/v1/users', data).success(function(result) {
          $scope.data1 = [{'email' : 'asdasdata.email'}];
          $location.path('/api/users-welcome');
        });
//      $location.path('/');
      }
    });
  }; //$scope.add
});
