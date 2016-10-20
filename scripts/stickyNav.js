$(document).ready(function() {

  $(window).scroll(function () {
      //if you hard code, then use console
      //.log to determine when you want the
      //nav bar to stick.
    if ($(window).scrollTop() > $('.upper_content').height()) {
      $('#navBar').addClass('navbar-fixed');
      $('#navBar-spacer').addClass('active');
    }
    if ($(window).scrollTop() <= $('.upper_content').height()) {
      $('#navBar').removeClass('navbar-fixed');
      $('#navBar-spacer').removeClass('active');
    }
  });
});