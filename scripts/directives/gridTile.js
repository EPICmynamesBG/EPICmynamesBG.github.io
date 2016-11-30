app.directive('gridTile', function ($interval) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      project: '='
    },
    templateUrl: './views/directives/grid-tile.html',
    link: function(scope, element, attrs){
      scope.carouselIndex = 0;
      var carouselTime = 4500;
      
      this.carousel = $interval(function(){
        scope.carouselIndex += 1;
        if (scope.project.images.length == scope.carouselIndex){
          scope.carouselIndex = 0;
        }
        console.log(scope.carouselIndex);
      }, carouselTime);
      
      
    }
//    controller: 'NavController'
  }
});