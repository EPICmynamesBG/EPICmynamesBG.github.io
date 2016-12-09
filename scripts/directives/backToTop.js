app.directive('backToTop', function () {
  return {
    restrict: 'E'
    , replace: true
    , scope: {}
    , template: '<div id="goToTop" class="btn btn-floating waves-effect waves-light" ng-click="toTop()"><i class="material-icons">keyboard_arrow_up</i></div>'
    , link: function (scope, element, attrs) {
      $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
          element.addClass('show');
        }
        else {
          element.removeClass('show');
        }
        
        if ($(window).width() <= 750) {
          if ($(this).scrollTop() >= $(window).height() - 1) {
            element.addClass('upfix');
          }
          else {
            element.removeClass('upfix');
          }
        } else {
          element.removeClass('upfix');
        }
      });
      scope.toTop = function () {
        $("html, body").animate({
          scrollTop: 0
        }, 600);
        return false;
      };
    }
  }
});