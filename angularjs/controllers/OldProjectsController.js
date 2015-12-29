app.controller("OldProjectsController", function ($scope, $location, $json) {

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
	
	$scope.viewNewerProjects = function() {
		$location.path("/projects");
	};

    $scope.projects = [];

    $json.loadFile("oldProjects.json")
        .then(function successCallback(response) {
            $scope.projects = response.data;
        }, function errorCallback(response) {
            $json.errorResponse(response);
        });
});