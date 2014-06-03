'use strict';

angular.module('moneyApp').
  controller('StateMonthsCtrl', function($scope, $http, $q, ngTableParams) {
    $scope.data = [];

    $scope.init = function () {
      $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10,          // count per page
        sorting: {
          date: 'desc'     // initial sorting
        }
      }, { 
        getData: function($defer, params) {
          getList(params).then(function(result){
            params.total(result.data.results.total_count);  // total length of data
            $defer.resolve(result.data.results.data);
          });
        }
      });
    };

    //리스트 조회
    function getList(params) {
      var deferred = $q.defer();
      //console.log('[state-months] getList() start... params.$params='+JSON.stringify(params.$params));

      // 검색조건
      var page_no = params.$params.page; // 검색결과 페이지 번호
      var page_size = params.$params.count; // 한 페이지에 출력될 결과수
      var sort_type = ''; // 정렬 항목명
      var sort_order = ''; // 정렬 종류 (asc, desc)
      $(params.$params.sorting).each(function(idx, elmt){
        $.each(elmt, function(key, value){
          sort_type = key;
          sort_order = value;
        });
      });
      var q = ''; // 검색을 원하는 질의어
      $(params.$params.filter).each(function(idx, elmt){
        $.each(elmt, function(key, value){
          q = value; // key = name
        });
      });

      // url 생성
      var url = '/api/v1/state-months';
      if (page_size != undefined) url += '?page_size='+page_size;
      if (q != undefined) url += '&q='+q;
      if (page_no != undefined) url += '&page_no='+page_no;
      if (sort_type !== '' && sort_order !== '') url += '&sort_type='+sort_type+'&sort_order='+sort_order;
      
      $http.get(url).then(function(result) {
        $scope.data = result.data.results.data;
        deferred.resolve(result);
      });

      return deferred.promise;
    };

  });

