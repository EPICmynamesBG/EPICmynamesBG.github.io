app.controller('AboutController', function ($scope, $json) {

  $json.loadFile('information/general')
    .then(function (data) {
      $scope.generalInfo = data;
    }, function (error) {
      console.log(error);
    });

});