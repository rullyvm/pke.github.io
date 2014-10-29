
/*



Copyright 2014 Mayday PAC

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


function numberWithCommas(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function updateTotals() {
  jQuery.getJSON('https://pledge.mayday.us/r/total', function(data) {
    totalRaised = data.totalCents/100 + (1408240.42+1775000);//+offline contributions
    totalRaised = Math.round(totalRaised);
    $('#total-donated').text('$' + numberWithCommas(totalRaised));
  });

  jQuery.getJSON('https://pledge.mayday.us/r/num_pledges', function(data) {
    $('#total-donors').text(numberWithCommas(data.count+4917+6));//+offline contributions
  });
}
// Normalize Carouselw5 Heights - pass in Bootstrap Carousel items.
$.fn.carouselHeights = function() {
  var items = $(this),
    heights = [],
    tallest;

  var normalizeHeights = function() {
    items.each(function() {
      heights.push($(this).height());
    });
    tallest = Math.max.apply(null, heights);
    items.each(function() {
      $(this).css('min-height',tallest + 'px');
    });
  };

  normalizeHeights();

  $(window).on('resize orientationchange', function () {
    tallest = 0;
    heights.length = 0;

    items.each(function() {
      $(this).css('min-height','0');
    });
    normalizeHeights();
  });
};