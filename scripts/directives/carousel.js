app.directive('carousel', function ($interval) {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      imageArray: '='
    },
    templateUrl: './views/directives/carousel.html',
    link: function (scope, element, attrs) {
      
      scope.paused = false;
      
      scope.carouselIndex = 0;
      
      var carouselTime = 4500;

      this.carousel = $interval(function () {
        scope.carouselIndex += 1;
        if (scope.project.images.length == scope.carouselIndex) {
          scope.carouselIndex = 0;
        }
      }, carouselTime);
      
      /**
       * Toggle Playback function, starts/pauses carousel
       * @author Brandon Groff
       */
      scope.togglePlayback = function() {
        scope.paused = !scope.paused;
      }

    }
  }
});