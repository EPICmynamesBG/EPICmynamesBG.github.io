$(document).ready(function() {

  $(window).scroll(function () {
      //if you hard code, then use console
      //.log to determine when you want the 
      //nav bar to stick.  
      console.log($(window).scrollTop())
    if ($(window).scrollTop() > $('.upper_content').height()) {
      $('#navBar').addClass('navbar-fixed');
    }
    if ($(window).scrollTop() <= $('.upper_content').height()) {
      $('#navBar').removeClass('navbar-fixed');
    }
  });
});