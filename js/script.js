$(document).ready(function (){
    dateshow(); 
    updateChargeInfo();
    updateLevelInfo();

    var topoffset = 70; //variable for menu height

    //Use smooth scrolling when clicking on navigation
    $('.navbar-nav a').click(function() {
      if (location.pathname.replace(/^\//,'') === 
        this.pathname.replace(/^\//,'') && 
        location.hostname === this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
        if (target.length) {
          $('html,body').animate({
            scrollTop: target.offset().top-topoffset
          }, 500);
          return false;
        } //target.length
      } //click function
    }); //smooth scrolling
});

// ===================================================  RUN THE CLOCK BELOW  ===========================================================


const resetb = document.getElementsByClassName("mySlides");
const menudd = document.querySelector(".navdivs");
const HOURHAND = document.querySelector("#hourhand");
const MINUTEHAND = document.querySelector("#minutehnd");
const SECONDHAND = document.querySelector("#secondarm");
const SECONDHANDS = document.querySelector("#seccc");
const DATE = document.querySelector("#datebox");

// --------------------------------------------------------------------------------------------

var date = new Date();
let hr = date.getHours();
let min = date.getMinutes();
let sec = date.getSeconds();
let dt = date.getDate();

if(dt<10) {
    dt = "0"+dt
  }
  
  let hrPosition = (hr*360/12)+(min*(360/60)/12);
  let minPosition = (min*360/60)+(sec*(360/60)/60);
  let secPosition = sec*360/60;
  let dtPosition = dt
  

function runTheClock() {
    if(hr >= 12 ){
      document.querySelector("#ampm").innerHTML = "PM";
      document.querySelector("#ampm").style.fill = "#defcf9ff";
      document.querySelector("#ampm").style.stroke = "#000000ff"
    }
    if(hr < 12 ){
     document.querySelector("#ampm").innerHTML = "AM"
     document.querySelector("#ampm").style.fill = "white";
     document.querySelector("#ampm").style.stroke = "black"
   }
 
     hrPosition = hrPosition+(3/360);
     minPosition = minPosition+(6/60);
     secPosition = secPosition+6;
     dtPosition = dt;
 
     HOURHAND.style.transform = "rotate(" + hrPosition + "deg)";
     MINUTEHAND.style.transform = "rotate(" + minPosition + "deg)";
     SECONDHAND.style.transform = "rotate(" + secPosition + "deg)";
     SECONDHANDS.style.transform = "rotate(" + secPosition + "deg)";
 }

 setInterval(runTheClock, 1000);

 // BATTERY FUNCTIONS

navigator.getBattery().then(function(battery){
    function updateAllBatteryInfo(){
      updateChargeInfo();
      updateLevelInfo();
      updateChargingInfo();
      updateDischargingInfo();
        }    
  
    battery.addEventListener('chargingchange', function(){
      updateChargeInfo();
    });

    function updateChargeInfo(){
      
      if(battery.charging){
      $("#ssss").css("fill", "black"); 
      $("#ssss").css("stroke", "black")    }

    if(!battery.charging){
        $("#ssss").css("fill", "none");
        $("#ssss").css("stroke", "none")
    }
    }

    updateChargeInfo()
  
    battery.addEventListener('levelchange', function() {
      updateLevelInfo();
    });
    
    function updateLevelInfo(){   
  
    if(battery.level*100 === 100){
        $(" #per25").css("width", "3.36822999");
        $(" #per25").css("fill", "19e42f");
        $("#batterybox").css("fill", "19e42f");
        $("#batteryboxtop").css("fill", "19e42f");
    } 

    if(battery.level*100 >= 95 && battery.level*100 < 100){
        $(" #per25").css("width", "3.36822999");
        $(" #per25").css("fill", "19e42f");
        $("#batterybox").css("fill", "19e42f");
        $("#batteryboxtop").css("fill", "ffffff");
    } 
     
    if(battery.level*100 >= 75 && battery.level*100 < 95){
        $(" #per25").css("width", "2.96822999");
        $(" #per25").css("fill", "19e42f");
        $("#batterybox").css("fill", "ffffff");
        $("#batteryboxtop").css("fill", "ffffff");
    } 
   
    if(battery.level*100 >= 50 && battery.level*100 < 75){
        $(" #per25").css("width", "2.52617249");
        $(" #per25").css("fill", "19e42f");
        $("#batterybox").css("fill", "ffffff");
        $("#batteryboxtop").css("fill", "ffffff");

    } 
    if(battery.level*100 >= 25 && battery.level*100 < 50){
        $(" #per25").css("width", "1.684115");
        $(" #per25").css("fill", "19e42f");
        $("#batterybox").css("fill", "ffffff");
        $("#batteryboxtop").css("fill", "ffffff");
    } 
    if(battery.level*100 >= 20 && battery.level*100 < 25){
        $(" #per25").css("width", "0.8420575");
        $(" #per25").css("fill", "19e42f");
        $("#batterybox").css("fill", "ffffff");
        $("#batteryboxtop").css("fill", "ffffff");
    } 
    if(battery.level*100 < 20){
      $("#per25").css("width", "0.5420575");
      $("#per25").css("fill", "red");
      $("#batterybox").css("fill", "ffffff");
      $("#batteryboxtop").css("fill", "red");
    } 
  }
});

// DATE FUNCTION

function dateshow(){
    const daysnames = [
      "SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"
  ];
  
  const d = new Date();
  
    var datez = new Date(),
  
     dayw = datez.getDay(),
     datew = datez.getDate(),
    
    datew = addZero(datew);
  
    document.getElementById("datetxt").innerHTML = daysnames[d.getDay()]; 
    document.getElementById("sssss").innerHTML = " " + datew
  }
  
  function addZero(val){
    return (val <=9) ? ("0" + val) : val;
  }
  
 
//  CLOCK FUNCTION ENDS HERE
// 

// ==================================================  HEADER SHOW AND HIDE BELOW ======================================================

$(".carousel-item img").click(function(){
  $("header").fadeToggle()
});

// var lastScrollTop = 0;

// window.addEventListener("scroll", function(){
//  var st = window.pageYOffset || document.documentElement.scrollTop;

//  if (st > lastScrollTop){
//   $("header").slideUp("fast")
// }

//   if(st < lastScrollTop){
//   $("header").slideDown("fast")
// }

//   lastScrollTop = st <= 0 ? 0 : st; //MOBILE SCROLL

// }, false);

$("#headerhover").mouseover(function(){
  $("header").fadeIn("slow")
})

$(".headerlink").click(function(){
  $("header").fadeOut()
})

// ============================== Scroll Animation ==============================================

var $animation_elements = $('.animation-element');
var $window = $(window);

function check_if_in_view() {
  var window_height = $window.height();
  var window_top_position = $window.scrollTop();
  var window_bottom_position = (window_top_position + window_height);

  $.each($animation_elements, function() {
    var $element = $(this);
    var element_height = $element.outerHeight();
    var element_top_position = $element.offset().top;
    var element_bottom_position = (element_top_position + element_height);

    //check to see if this current container is within viewport
    if ((element_bottom_position >= window_top_position) &&
      (element_top_position <= window_bottom_position)) {
      $element.addClass('in-view');
    } else {
      $element.removeClass('in-view');
    }
  });
}

$window.on('scroll resize', check_if_in_view);
$window.trigger('scroll');