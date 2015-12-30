app.controller("OldProjectsController", function ($scope, $location, $json) {

    $scope.showPopup = false;
	$scope.popupImage = null;
	var currentProj = null;
	var currentImg = null;
	
	$scope.showImagePopup = function(image, imgIndex, parentIndex){
		$scope.showPopup = true;
		$scope.popupImage = image;
		currentProj = parentIndex;
		currentImg = imgIndex;
	};
	
	$scope.popupNavigation = function (nav) {
		if (currentImg != null) {
			var next = currentImg + nav;
			if (next < 0){ // below valid range, go to last
				next = $scope.projects[currentProj].images.length-1;
			} else if (next >= $scope.projects[currentProj].images.length){ // exceeds valid range
				next = 0;
			} else {
				//next is valid
			}
			currentImg = next;
			$scope.popupImage = $scope.projects[currentProj].images[currentImg];
		};
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