angular.module('personsIndex', [])
.controller('PersonsIndexController', function($scope, $http, $location) {

	$http.get('/publicapi/persons')
	.success(function(data){
		$scope.allPersons = data;
	})
	.error(function(data) {
		console.log('Error:' + data);
	});

	$scope.personClicked = function(person) {
		console.log(person);
		$scope.clickedPerson = person;
	}

});
