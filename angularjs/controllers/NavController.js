app.controller("NavController", function ($scope, $location, $route) {

	$scope.current = "Projects";
	
	var updateCurrent = function(){
		var route = $location.$$path;
		if (route == "/gallery"){
			$scope.current = "Gallery";
		} else if (route == "/information"){
			$scope.current = "Information";
		} else if (route == "/projects" || route == "/"){
			$scope.current = "Projects"
		} else {
			$scope.current = "";
		}
	};
	
    $scope.infoClick = function () {
        $location.path("/information");
		updateCurrent();
    };

    $scope.projectClick = function () {
        $location.path("/projects");
		updateCurrent();
    };

    $scope.galleryClick = function () {
        $location.path("/gallery");
		updateCurrent();
    };

    $scope.homeClick = function () {
        $location.path("/");
		updateCurrent();
    };
	
	updateCurrent();
});