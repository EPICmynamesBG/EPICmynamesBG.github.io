app.controller("GalleryController", function ($scope, $location, $json) {

    $scope.photoGallery = [];

    $json.loadFile("gallery.json")
        .then(function successCallback(response) {
            $scope.photoGallery = response.data;
        }, function errorCallback(response) {
            $json.errorResponse(response);
        });

    $scope.leftHovering = false;
    $scope.rightHovering = false;
    var currentIndex = 0;

    $scope.loadImage = function (index) {
        currentIndex = index;
        $scope.selectedImageURL = $scope.photoGallery[currentIndex].image;
        $scope.showPopup = true;
    }

    $scope.closePopup = function () {
        $scope.showPopup = false;
    }

    $scope.next = function () {
        currentIndex += 1;
        if (currentIndex > $scope.photoGallery.length - 1) {
            currentIndex = 0;
        }
        $scope.selectedImageURL = $scope.photoGallery[currentIndex].image;
    }

    $scope.previous = function () {
        currentIndex -= 1;
        if (currentIndex < 0) {
            currentIndex = $scope.photoGallery.length - 1;
        }
        $scope.selectedImageURL = $scope.photoGallery[currentIndex].image;
    }
});