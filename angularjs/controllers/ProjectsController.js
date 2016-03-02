app.controller("ProjectsController", function ($scope, $location, $json) {

	$scope.projects = [];
	$scope.showPopup = false;
	$scope.popupImage = null;
	var currentProj = null;
	var currentImg = null;

	$scope.showImagePopup = function (image, imgIndex, parentIndex) {
		$scope.showPopup = true;
		$scope.popupImage = image;
		var popup = document.getElementById("popup");
		popup.focus();
		currentProj = parentIndex;
		currentImg = imgIndex;
	};
	
	$scope.closePopup = function(){
		$scope.showPopup=false;
		var popup = document.getElementById("popup");
		popup.blur();
	}

	$scope.popupNavigation = function (nav) {
		if (currentImg != null) {
			var next = currentImg + nav;
			if (next < 0) { // below valid range, go to last
				next = $scope.projects[currentProj].images.length - 1;
			} else if (next >= $scope.projects[currentProj].images.length) { // exceeds valid range
				next = 0;
			} else {
				//next is valid
			}
			currentImg = next;
			$scope.popupImage = $scope.projects[currentProj].images[currentImg];
		};
	};

	$scope.key = function ($event) {
		if ($event.keyCode == 39) {
			$scope.popupNavigation(1);
		}
		else if ($event.keyCode == 37){
			$scope.popupNavigation(-1);
		}
		else if ($event.keyCode == 27){
			$scope.closePopup();
		}
	}

	$scope.singleProjectClick = function (title) {
		$location.path("/projects/" + title);
	};

	$scope.viewOldProjects = function () {
		$location.path("/old-projects/");
	};

	$json.loadFile("projects.json")
		.then(function successCallback(response) {
			$scope.projects = response.data;
		}, function errorCallback(response) {
			$json.errorResponse(response);
		});
});