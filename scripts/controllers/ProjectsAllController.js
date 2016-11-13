app.controller('ProjectsAllController', function ($scope, $json) {

  $json.loadFile('projects')
    .success(function (data) {
      $scope.projectList = data;
    })
    .error(function (error) {
      console.log(error);
    });
});