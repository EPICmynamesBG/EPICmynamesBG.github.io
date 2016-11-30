app.directive('gridList', function ($interval) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      project: '=',
      carouselTime: '='
    },
    templateUrl: './views/directives/grid-list.html',
    link: function(scope, element, attrs){
      scope.carouselIndex = 0;
      var carouselTime = 3000;
      
      this.carousel = $interval(function(){
        scope.carouselIndex += 1;
        if (scope.project.images.length == scope.carouselIndex){
          scope.carouselIndex = 0;
        }
      }, carouselTime);
      
      
      
    }
//    controller: 'NavController'
  }
});