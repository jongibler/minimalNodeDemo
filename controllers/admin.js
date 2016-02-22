angular.module('personsApp', [])
.controller('AdminController', function($scope, $http, $location) {

	$http.get('/api/persons')
	.success(function(data){
		$scope.allPersons = data;				
	})
	.error(function(data) {
		console.log('Error:' + data);
	});
});