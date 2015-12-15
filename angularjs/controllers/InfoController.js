app.controller("InformationController", function ($scope, $location, $json) {


    $scope.personalityTraits = [];

    $json.loadFile("information/personalityTraits.json")
        .then(function successCallback(response) {
            $scope.personalityTraits = response.data;
        }, function errorCallback(response) {
            $json.errorResponse(response);
        });

    $scope.skills = [];

    $json.loadFile("information/skills.json")
        .then(function successCallback(response) {
            $scope.skills = response.data;
        }, function errorCallback(response) {
            $json.errorResponse(response);
        });

    $scope.interests = [];

    $json.loadFile("information/interests.json")
        .then(function successCallback(response) {
            $scope.interests = response.data;
        }, function errorCallback(response) {
            $json.errorResponse(response);
        });

    $scope.jobs = [];

    $json.loadFile("information/jobs.json")
        .then(function successCallback(response) {
            $scope.jobs = response.data;
        }, function errorCallback(response) {
            $json.errorResponse(response);
        });
});