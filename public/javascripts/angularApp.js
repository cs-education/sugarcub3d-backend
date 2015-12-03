var app = angular.module('3dFoodPrinter', []);

// main controller
app.controller('MainCtrl', [
'$scope',
'$http',
function($scope, $http){
	$http.get("/random").then(function(response){
		$scope.question = response.data.question;
		$scope.choices = response.data.choices;
		$scope.answer = response.data.answer;
	});
}]);