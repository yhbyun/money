'use strict';

angular.module('moneyApp')
  .controller('UserCtrl', function ($scope, $http, ngTableParams) {

    //µî·Ï
    $scope.add = function($data) {
      var data = $data;
      $http.post('/api/v1/users', data).success(function(result) {
        $http.get('/api/users-welcome').then(function(result) {
          $scope.data = result.data.results.data;
          data = $scope.data;
        });
    });
  };

});
