app.controller('AboutController', function ($scope, $json) {

  $json.loadFile('information/general')
    .then(function (data) {
      $scope.generalInfo = data.data;
    }, function (error) {
      console.log(error);
    });

});