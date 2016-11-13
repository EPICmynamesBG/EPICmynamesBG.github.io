app.controller('ProjectsController', function ($scope, $json) {

  $json.loadFile('projects')
    .success(function (data) {
      $scope.projectList = data;
//      $(document).ready(function () {
//        $('ul.tabs').tabs();
//      });
    })
    .error(function (error) {
      console.log(error);
    });

});