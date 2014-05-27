'use strict';

angular.module('moneyApp').
  controller('MainCtrl', function($scope, $http, ngTableParams) {
  var data = [];
  var itemdata = [];

   //리스트
   $scope.init = function () {
   $http.get('/api/v1/moneybooks/').then(function(result) {
      $scope.data = result.data.results.data;
      data = $scope.data;
    });
  };

  //등록
  $scope.add = function($data) {
    var data = $data;
    $http.post('/api/v1/moneybooks/', data).success(function(result) {
      data.item = '';
      data.amount = '';
      data.date = '';
    $scope.init(); //페이지 리로드  
    });
  };

  //업데이트
  $scope.update = function($data) {
    var data = $data;
    $http.put('/api/v1/moneybooks/'+ data.id, data).success(function(result) {
      $scope.init(); //페이지 리로드  
    });
  };

  //삭제
  $scope.delete = function($data) {
    var data = $data;
    $http.delete('/api/v1/moneybooks/'+ data).success(function(result) {
      $scope.init(); //페이지 리로드  
    });
  };

  //자동완성
  $scope.items = function($data) {
    var data = $data;
    $http.get('/api/v1/auto-items/?q='+ data).then(function(result) {
      //console.log('[auto-items] result='+JSON.stringify(result));
      $scope.itemdata = result.data.results;
      itemdata = $scope.itemdata;
    });
  };

 $scope.moneyBooks = new ngTableParams({
    page: 1,            // show first page
    count: 10,          // count per page
    sorting: {
      date: 'desc'     // initial sorting
    }
   }, { 
    total: data.length, // length of data
      getData: function($defer, params) {
      $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
    }
  });
});

