app.controller("OldProjectsController", function ($scope, $location, $json) {

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