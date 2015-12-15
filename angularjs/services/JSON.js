app.service("$json", function($http){

    var location="json/"

    this.loadFile = function(filename){
        return $http.get(location + filename);
    }

    this.errorResponse = function(error){
        alert("Error fetching data.");
        console.log(error);
    }
});