/* Copyright 2014 Mayday PAC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

$(document).ready(function() {

	//background scrolling effects

    var scrollorama = $.scrollorama({
        blocks:'.scrollblock'
    });

    scrollorama
    	.animate('.intro-text',{delay:200, duration:300, property:'opacity', start:1, end:0})
    	.animate('.background',{delay:0, duration:200, property:'opacity', start:1, end:0.7});


    //Draggable scroll boxes

    (function($) {
	    $.fn.drags = function(opt) {

	        opt = $.extend({handle:"",cursor:"move"}, opt);

	        if(opt.handle === "") {
	            var $el = this;
	        } else {
	            var $el = this.find(opt.handle);
	        }

	        return $el.css('cursor', opt.cursor).on("mousedown", function(e) {
	            if(opt.handle === "") {
	                var $drag = $(this).addClass('draggable');
	            } else {
	                var $drag = $(this).addClass('active-handle').parent().addClass('draggable');
	            }
	            var z_idx = $drag.css('z-index'),
	                drg_h = $drag.outerHeight(),
	                drg_w = $drag.outerWidth(),
	                pos_y = $drag.offset().top + drg_h - e.pageY,
	                pos_x = $drag.offset().left + drg_w - e.pageX;
	            $drag.css('z-index', 1000).parents().on("mousemove", function(e) {
	                $('.draggable').offset({
	                    top:e.pageY + pos_y - drg_h,
	                    left:e.pageX + pos_x - drg_w
	                }).on("mouseup", function() {
	                    $(this).removeClass('draggable').css('z-index', z_idx);
	                });
	            });
	            e.preventDefault(); // disable selection
	        }).on("mouseup", function() {
	            if(opt.handle === "") {
	                $(this).removeClass('draggable');
	            } else {
	                $(this).removeClass('active-handle').parent().removeClass('draggable');
	            }
	        });

	    }
	})(jQuery);

	$('.drags').drags();

	//Functionality for closing out error boxes

	$( ".error-close" ).click(function() {
    var boxToClose = $(this).closest('li');
	  boxToClose.fadeOut( 300 );
    setTimeout(function(){boxToClose.fadeIn( 300 );}, 3000);
	});

	//Fixed 'pledge' bar

	$(window).scroll(function() {
	    var scroll = $(window).scrollTop();

	    if (scroll >= 1000) {
	        $(".cta").addClass("fix");
	    } else {
	        $(".cta").removeClass("fix");
	    }
	});

	//Removing the animation background after scrolling

	$(window).scroll(function() {
	    var scroll = $(window).scrollTop();

	    if (scroll >= 500) {
	        $(".background").removeClass("blink");
	    } else {
	        $(".background").addClass("blink");
	    }
	});

	//Tooltip content

	$('.tooltip.superpacs').tooltipster({
        content: $('<p>In 2010, two court rulings (<em>Citizens United v. Federal Election Commission</em> and <em>Speechnow.org v. FEC</em>) gave rise to a form of political action committee ("Super PACs") that can spend unlimited sums of money on election activities, and can accept donations from any source with no limits on donation size.</p>'),
        animation: 'grow',
        interactive: true,
        speed:200
    });

    $('.tooltip.princeton').tooltipster({
        content: $('<p><a href="http://www.princeton.edu/~mgilens/Gilens%20homepage%20materials/Gilens%20and%20Page/Gilens%20and%20Page%202014-Testing%20Theories%203-7-14.pdf" class="button" target="_blank">View the report</a></p>'),
        animation: 'grow',
        interactive: true,
        speed:200
    });


    //Functionality for clickable vid gallery

    $(".vid-link").on("click", function(event) {
		event.preventDefault();
		$(".big-vid .vid-contain iframe").prop("src", $(event.currentTarget).attr("href"));
		$('html,body').animate({
			scrollTop: $('.vid-contain').offset().top - 80
		}, 800);
		$( ".vid-link" ).removeClass( "active" );
		$( this ).addClass( "active" );
	});



	//Updating the thermometer with live data

	function setText(el, val) {
	  el = document.getElementById(el);
	  if (el.textContent !== undefined)
	    el.textContent = val;
	  else
	    el.innerText = val;
	}

	function totalRaisedCB(totalRaisedCents) {
	  var totalRaised = (totalRaisedCents / 100) - 1000000;
	  var totalMillions = totalRaised / 1000000;
	  var complete_total = (totalRaisedCents / 100);
	  var percent = Math.floor(totalRaised / 50000);
	  if (percent > 100) {
	    percent = 100
	  }
	  document.getElementById("currentBar").style.width= Math.min(100, percent) + '%';

	var totalRaisedRounded = totalMillions.toFixed(1);
	var complete_total_message = '$' + totalRaisedRounded + 'M';
	setText("currentNumber", complete_total_message);

	}

	jQuery.getJSON('https://pledge.mayday.us/r/total',
	   function(data) {
	     totalRaisedCB(data.totalCents);
	   });

	function ready(fn) {
	  if (document.addEventListener) {
	    document.addEventListener('DOMContentLoaded', fn);
	  } else {
	    document.attachEvent('onreadystatechange', function() {
	      if (document.readyState === 'interactive')
	        fn();
	    });
	  }
	}



	//Setting the deadline countdown dynamically

	var deadline = new Date(Date.UTC(2014,06,05,05,00,00,00)).getTime();

	var days;
	var daysRounded;

	var days_display = document.getElementById("days_display");

	setInterval(function () {

	  // Calculate
	  var current_date = new Date().getTime();
	  var seconds_remaining = (deadline - current_date) / 1000;

	  days = parseInt(seconds_remaining / 86400);
	  daysRounded = days + 1;
	  seconds_remaining = seconds_remaining % 86400;

	  // Account for the deadline
	  if (seconds_remaining <= 0) {
	    days = '00';
	  }

	  // Render
	  setText("days_display", daysRounded);

	}, 10);

});
