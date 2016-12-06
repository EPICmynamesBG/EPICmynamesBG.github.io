app.controller('ProjectsDetailsController', function ($scope, $stateParams, $json) {

  var title = $stateParams.projectName;

  $json.loadFile("projects/" + title)
    .then(function successCallback(response) {
      $scope.project = response.data;
    }, function errorCallback(response) {
      $json.errorResponse(response);
    });

});