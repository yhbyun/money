'use strict';

angular.module('moneyApp').
  controller('MainCtrl', function($scope, $http, $filter, $q, ngTableParams) {
  var data = [];
    $http.get('/api/v1/moneybooks').then(function(result) {
        $scope.data = result.data.results.data;
        data = $scope.data;
    });

  $scope.enter = function($kk, $ss) {
    if($kk !== "" && $ss !== "") {
      
    } else{
       
    }
  };

 $scope.moneyBooks = new ngTableParams({
    page: 1,            // show first page
    count: 10,          // count per page
    sorting: {
      date: 'desc'     // initial sorting
    }
    }, {
    total: data.length, // length of data
    getData: function ($defer, params) {
        $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      }
  });
});
