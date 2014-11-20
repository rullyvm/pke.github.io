
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

function post_to_url(path, params, method) {
  method = method || "POST"; // Set method to post by default, if not specified.

  // The rest of this code assumes you are not using a library.
  // It can be made less wordy if you use one.
  var form = document.createElement("form");
  form.setAttribute("method", method);
  form.setAttribute("action", path);

  for (var key in params) {
    if (params.hasOwnProperty(key)) {
      var hiddenField = document.createElement("input");
      hiddenField.setAttribute("type", "hidden");
      hiddenField.setAttribute("name", key);
      hiddenField.setAttribute("value", params[key]);
      form.appendChild(hiddenField);
    }
  }

  document.body.appendChild(form);
  form.submit();
}

function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
  return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
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