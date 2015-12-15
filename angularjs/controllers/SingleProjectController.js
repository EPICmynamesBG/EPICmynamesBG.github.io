app.controller("SingleProjectController", function ($scope, $route, $json) {

    $scope.project = [];

    var title = $route.current.params.title;

    var formatTitle = function (title) {
        var temp = toTitleCase(title);
        temp = temp.replace(/ /g, "");
        temp = temp.replace("(", "");
        temp = temp.replace(")", "");
        temp = temp.replace(/-/g, "");
        return temp;
    }

    function toTitleCase(str) {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    title = formatTitle(title);

    $json.loadFile("projects/" + title + ".json")
        .then(function successCallback(response) {
            console.log(response.data);
            $scope.project = response.data;
        }, function errorCallback(response) {
            $json.errorResponse(response);
        });
});