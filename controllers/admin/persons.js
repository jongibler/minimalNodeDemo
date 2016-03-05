angular.module('adminPersons', ['ngTagsInput'])
//todo refactor file upload directive/service out of here
.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}])
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

    clearFileInputValue();

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

	$scope.uploadPDF = function(){
    if ($scope.pdfFile == undefined) {
      return;
    }
		var file = $scope.pdfFile;
		var uploadUrl = "/uploadPDF";
		var fd = new FormData();
		fd.append('file', file);
		$http.post(uploadUrl, fd, {
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}
		})
		.success(function(data){
			$scope.person.uploadedPDFUrl = data;
		})
		.error(function(err){
			console.log(err);
		});
	};

  $scope.clearPDF = function(){    
    $scope.pdfFile = undefined;
    $scope.person.uploadedPDFUrl = "";
    clearFileInputValue();

    //TODO: Delete uploaded preview file from s3
  };

  function clearFileInputValue(){
    //TODO: two way binding of input file
    $('input:file').val('');
  };

});
