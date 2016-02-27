angular.module('adminPersons', ['ngTagsInput'])
.controller('AdminPersonsController', function($scope, $http, $timeout, $anchorScroll, $location, $document) {

	var personId = $location.absUrl().substr($location.absUrl().lastIndexOf('/') + 1);
	$scope.isNewPerson = personId == 'new';

	if (!$scope.isNewPerson){
		$http.get('/api/persons/' + personId)
		.then(function(res){
			$scope.person = res.data;
			if ($scope.person == null)
				$scope.isNewPerson = true;
		},function(res) {
			console.log('Error:' + res.data);
			$scope.isNewPerson = true;
		});
	}

	$scope.save = function(person){

		if (!$scope.personForm.$valid){
			return;
		}

		$http.post('/api/persons', person)
		.then(function(res){
			$scope.message="Person saved!";
			$timeout(function(){$scope.message="";}, 2000);
			$scope.clearForm();
		},function(res) {
			console.log('Error:' + res.data);
		});
	};

	$scope.clearForm = function(){
		$scope.person = {};
		$scope.personForm.$setPristine();
		$scope.isNewPerson = true;
		$anchorScroll();
	};

	$scope.delete = function() {
		$http.delete('/api/persons/' + personId)
		.success(function(data) {
			$scope.message="Person deleted!";
			$timeout(function(){$scope.message="";}, 2000);
			$scope.clearForm();
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	};



	$http.get('/api/persons')
	.success(function(data){
		$scope.allPersons = data;
	})
	.error(function(data) {
		console.log('Error:' + data);
	});


});
