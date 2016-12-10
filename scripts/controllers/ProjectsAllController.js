app.controller('ProjectsAllController', function ($scope, $json, $stateParams, $state) {

  if (!$stateParams.style || $stateParams.style == "") {
    $stateParams.style = 'tiles';

    $state.go('Projects.All', {
      style: $stateParams.style
    }, {
      notify: false,
      location: "replace"
    });

  };
  $scope.gridStyle = $stateParams.style;

  $json.loadFile('projects')
    .then(function (data) {
      $scope.projectList = data.data;
    }, function (error) {
      console.log(error);
    });


  $scope.$watch('gridStyle', function (newVal, oldVal) {
    if (newVal != oldVal) {
      $state.go('Projects.All', {
        style: newVal
      }, {
        notify: false,
        location: "replace"
      });
    }
  });


});