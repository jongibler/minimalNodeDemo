angular.module('personsIndex', [])
.controller('PersonsIndexController', function($scope, $http, $location) {

	$http.get('/publicapi/persons')
	.success(function(data){
		$scope.allPersons = data;
	})
	.error(function(data) {
		console.log('Error:' + data);
	});
});