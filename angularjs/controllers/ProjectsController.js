app.controller("ProjectsController", function ($scope, $location, $json) {

    $scope.showPopup = false;
	$scope.popupImage = null;
	
	$scope.showImagePopup = function(image){
		$scope.showPopup = true;
		$scope.popupImage = image;
		console.log("Show popup");
	};
	
	$scope.singleProjectClick = function (title) {
        $location.path("/projects/" + title);
    };
	
	$scope.viewOldProjects = function() {
		$location.path("/old-projects/");
	};

    $scope.projects = [];

    $json.loadFile("projects.json")
        .then(function successCallback(response) {
            $scope.projects = response.data;
        }, function errorCallback(response) {
            $json.errorResponse(response);
        });
});