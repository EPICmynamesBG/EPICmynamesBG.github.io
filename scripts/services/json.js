app.service("$json", function ($http) {

  var location = "json/"

  this.loadFile = function (filename) {
    return $http.get(location + filename);
  }

  this.errorResponse = function (error) {
    alert("An error occured loading the remote data. Please reload the page to try again.");
    console.log(error);
  }
});