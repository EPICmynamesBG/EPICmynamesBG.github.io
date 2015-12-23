app.controller("NavController", function ($scope, $location, $route) {

	$scope.current = "Projects";
	
	var updateCurrent = function(){
		var route = $location.$$path;
		if (route == "/information"){
			$scope.current = "Information";
		} else{
			$scope.current = "Projects"
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

    $scope.homeClick = function () {
        $location.path("/");
		updateCurrent();
    };
	
	updateCurrent();
});