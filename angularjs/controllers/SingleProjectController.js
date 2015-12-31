app.controller("SingleProjectController", function ($scope, $route, $json) {

    $scope.project = [];
	
	$scope.showPopup = false;
	$scope.popupImage = null;
	var currentImg = null;
	
	$scope.showImagePopup = function(image, imgIndex){
		$scope.showPopup = true;
		$scope.popupImage = image;
		currentImg = imgIndex;
	};
	
	$scope.popupNavigation = function (nav) {
		if (currentImg != null) {
			var next = currentImg + nav;
			if (next < 0){ // below valid range, go to last
				next = $scope.project.images.length-1;
			} else if (next >= $scope.project.images.length){ // exceeds valid range
				next = 0;
			} else {
				//next is valid
			}
			currentImg = next;
			$scope.popupImage = $scope.project.images[currentImg];
		};
	};

    var title = $route.current.params.title;

    var formatTitle = function (title) {
        var temp = toTitleCase(title);
        temp = temp.replace(/ /g, "");
        temp = temp.replace("(", "");
        temp = temp.replace(")", "");
        temp = temp.replace(/-/g, "");
        return temp;
    }

    function toTitleCase(str) {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    title = formatTitle(title);

    $json.loadFile("projects/" + title + ".json")
        .then(function successCallback(response) {
            $scope.project = response.data;
        }, function errorCallback(response) {
            $json.errorResponse(response);
        });
});