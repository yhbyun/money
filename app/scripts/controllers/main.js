'use strict';

angular.module('moneyApp').
controller('MainCtrl', function($scope, $filter, $q, ngTableParams) {
    var data = [{id: 1, item: '점심', amount: 5000, date: '2014-04-14'},
			    {id: 2, item: '영화', amount: 10000, date: '2014-04-14'},
			    {id: 3, item: '점심', amount: 5000, date: '2014-04-13'},
			    {id: 4, item: '점심', amount: 5000, date: '2014-04-14'},
			    {id: 5, item: '교통비', amount: 3000, date: '2014-04-13'},
			    {id: 6, item: '점심', amount: 5000, date: '2014-04-14'},
			    {id: 7, item: '점심', amount: 5000, date: '2014-04-14'},
			    {id: 8, item: '점심', amount: 5000, date: '2014-04-14'},
			    {id: 9, item: '점심', amount: 5000, date: '2014-04-14'},
			    {id: 10, item: '점심', amount: 5000, date: '2014-04-14'},
			    {id: 11, item: '점심', amount: 5000, date: '2014-04-14'},
                {id: 12, item: '영화', amount: 10000, date: '2014-04-13'}];

    $scope.moneyBooks = new ngTableParams({
        page: 1,            // show first page
        count: 10           // count per page
    }, {
        total: data.length, // length of data
        getData: function($defer, params) {
            // use build-in angular filter
            var orderedData = params.sorting() ?
                    $filter('orderBy')(data, params.orderBy()) :
                    data;
            orderedData = params.filter() ?
                    $filter('filter')(orderedData, params.filter()) :
                    orderedData;

            params.total(orderedData.length); // set total for recalc pagination
            $defer.resolve($scope.users = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });
});