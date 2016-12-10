app.controller('ExperienceController', function ($scope, $json) {
  $json.loadFile('information/work')
    .then(function (data) {
      $scope.workHistory = data;
      $('.collapsible').collapsible();
    }, function (error) {
      console.log(error);
    });
});