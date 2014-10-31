

var width	= 840,
    height	= 500;

var state_code	= {
    "AL": "01",
    "AK": "02",
    "AZ": "04",
    "AR": "05",
    "CA": "06",
    "CO": "08",
    "CT": "09",
    "DE": "10",
    "DC": "11",
    "FL": "12",
    "GA": "13",
    "HI": "15",
    "ID": "16",
    "IL": "17",
    "IN": "18",
    "IA": "19",
    "KS": "20",
    "KY": "21",
    "LA": "22",
    "ME": "23",
    "MD": "24",
    "MA": "25",
    "MI": "26",
    "MN": "27",
    "MS": "28",
    "MO": "29",
    "MT": "30",
    "NE": "31",
    "NV": "32",
    "NH": "33",
    "NJ": "34",
    "NM": "35",
    "NY": "36",
    "NC": "37",
    "ND": "38",
    "OH": "39",
    "OK": "40",
    "OR": "41",
    "PA": "42",
    "RI": "44",
    "SC": "45",
    "SD": "46",
    "TN": "47",
    "TX": "48",
    "UT": "49",
    "VT": "50",
    "VA": "51",
    "WA": "53",
    "WV": "54",
    "WI": "55",
    "WY": "56",
    "AS": "60",
    "GU": "66",
    "MP": "69",
    "PR": "72",
    "UM": "74"
};

function code_senate(d) {
	var p		= d.properties,
		code 	= '';

	if (!d.properties.candidates) d.properties.candidates = [];

	_.each(reformData.reformers, function(r, i) {
		if (r.district == '00' && state_code[r.state] == d.id) {
			d.properties.candidates.push(i);
			code = (r.mayday == true || code == 'q8-9') ? 'q8-9' : 'q3-9';
		}
	})

	return code;
}

function code_house(d) {
	if (!d.properties.candidates) d.properties.candidates = [];

	/*	{
		ALAND: -2147483648
		AWATER: 201938199
		CD114FP: "36"
		CDSESSN: "114"
		FUNCSTAT: "N"
		GEOID: "0636"
		INTPTLAT: "+33.7300127"
		INTPTLON: "-115.7393369"
		LSAD: "C2"
		MTFCC: "G5200"
		NAMELSAD: "Congressional District 36"
		STATEFP: "06"
	} */

	var p		= d.properties,
		code 	= '';

	_.each(reformData.reformers, function(r, i) {
		if (p.CD114FP == r.district && p.STATEFP == state_code[r.state]) {
			d.properties.candidates.push(i);
			code = (r.endorsed == true || code == 'q8-9') ? 'q8-9' : 'q3-9';
		}
	})

	return code;
}

var projection = d3.geo.albersUsa()
    .scale(865)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var g = d3.select("svg")
    .attr("width", width)
    .attr("height", height);

queue()
    .defer(d3.json, "/data/vote-for-reform-map/us.json")
    .defer(d3.json, "/data/vote-for-reform-map/us-congress-114.json")
    .await(ready);

window.app = {};

function ready(error, us, congress) {
  if (error) return console.error(error);

  show_candidate = function(d) {
    $('#candidates').html('');

    var html = ['<p>Unfortunately, there are no reform candidates for that district</p>'];

    _.each(d.properties.candidates, function(c) {
    	var r = reformData.reformers[c];
    	r.full_name = r.first_name + ' ' + r.last_name;
        r.race_type = (r.district == '00') ? 'Senate' : 'House of Representatives';

        html = ['<div><h3>' + r.full_name + '</h3>\<h4>' + r.race_type + '</h4>'];
        if (r.endorsed == true) {
        	html.push('<p>Endorsed by MAYDAY.US, <span class="capitalize">' + r.last_name.toLowerCase() + '</span> \
        	Supports reform from ' + r.state + '!</p>');
        }
        html.push('</div>');
    });

    $('#candidates').append(html.join(''));

  }

  app.draw_senate = function() {
	  g.selectAll('g').remove();

	  g.append("g")
	      .attr("class", "states")
	    .selectAll("path")
	      .data(topojson.feature(us, us.objects.states).features)
	    .enter()
	    	.append("path")
		      .attr("class", function(d) { return code_senate(d); })
		      .on('mouseenter', show_candidate)
		      .on('click', show_candidate)
	    	  .attr("d", path);
  }

  app.draw_house = function() {
	  g.selectAll('g').remove();

	  g.append("g")
	      .attr("class", "districts")
	      .attr("clip-path", "url(#clip-land)")
	    .selectAll("path")
	      .data(topojson.feature(congress, congress.objects.districts).features)
	    .enter().append("path")
	      .attr("class", function(d) { return code_house(d); })
		  .on('mouseenter', show_candidate)
		  .on('click', show_candidate)
	      .attr("d", path);

	  g.append("path")
	      .attr("class", "district-boundaries")
	      .datum(topojson.mesh(congress, congress.objects.districts, function(a, b) { return a !== b && (a.id / 1000 | 0) === (b.id / 1000 | 0); }))
	      .attr("d", path);
  }

  app.draw_senate();

  $('#house').click(function() {
  	app.draw_house();
  	$('.active').removeClass('active');
  	$(this).addClass('active');
  });

  $('#senate').click(function() {
  	app.draw_senate();
  	$('.active').removeClass('active');
  	$(this).addClass('active');
  });

}

d3.select(self.frameElement).style("height", height + "px");