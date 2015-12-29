app.controller("SingleProjectController", function ($scope, $route, $json) {

    $scope.project = [];
	
	$scope.showPopup = false;
	$scope.popupImage = null;
	
	$scope.showImagePopup = function(image){
		$scope.showPopup = true;
		$scope.popupImage = image;
		console.log("Show popup");
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