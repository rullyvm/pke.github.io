var state_code_lookup  = { "AL": "01", "AK": "02", "AZ": "04", "AR": "05", "CA": "06", "CO": "08", "CT": "09", "DE": "10", "DC": "11", "FL": "12", "GA": "13", "HI": "15", "ID": "16", "IL": "17", "IN": "18", "IA": "19", "KS": "20", "KY": "21", "LA": "22", "ME": "23", "MD": "24", "MA": "25", "MI": "26", "MN": "27", "MS": "28", "MO": "29", "MT": "30", "NE": "31", "NV": "32", "NH": "33", "NJ": "34", "NM": "35", "NY": "36", "NC": "37", "ND": "38", "OH": "39", "OK": "40", "OR": "41", "PA": "42", "RI": "44", "SC": "45", "SD": "46", "TN": "47", "TX": "48", "UT": "49", "VT": "50", "VA": "51", "WA": "53", "WV": "54", "WI": "55", "WY": "56", "AS": "60", "GU": "66", "MP": "69", "PR": "72", "UM": "74" };

// UPDATE UNDERSCORE INTERPOLATOR to {%= %} because of html escaping with <%= %>
_.templateSettings = {
    evaluate    : /\[\[(.+?)\]\]/gim,
    interpolate : /\[\[\=(.+?)\]\]/gim
};

function is_senate_match(r, d) {
    return (r.role == 'legislatorUpperBody' && state_code_lookup[r.state] == d.id) ? true : false;
}

function is_house_match(r, d) {
    return (r.role == 'legislatorLowerBody' && d.CD114FP == r.district && d.STATEFP == state_code_lookup[r.state]) ? true : false;
}

function code_district(d) {
    var p       = d.properties,
        code    = '';

    if (!d.properties.candidates) d.properties.candidates = [];
    p.id = d.id;

    var func_conditional = {
        'legislatorUpperBody': is_senate_match,
        'legislatorLowerBody': is_house_match
    }

    _.each(reformData.reformers, function(r, i) {
        if (func_conditional[r.role](r, p)) {
            d.properties.candidates = _.uniq(d.properties.candidates.concat(i));
            code = (r.endorsed == true || code == 'endorsed') ? 'endorsed' : 'reformer';
        }
    })

    return code;
}

function show_default() {
    $('#candidates').html(_.template($('#default_candidate_tmp').html()));
}

function show_candidates(d) {
    var no_candidate    = _.template($('#no_candidate_tmp').html());
    var candidate       = _.template($('#candidate_tmp').html());

    $('#candidates').html('');

    if (d.properties.candidates.length == 0)
        return $('#candidates').html(no_candidate());

    _.each(d.properties.candidates, function(c) {
        var r       = reformData.reformers[c];
        r.full_name = r.first_name + ' ' + r.last_name;
        r.race_type = (r.role == 'legislatorUpperBody') ? 'Senate' : 'Congress';
        $('#candidates').append(candidate(r));
    });
}

queue()
    .defer(d3.json, "/data/vote-for-reform-map/us.json")
    .defer(d3.json, "/data/vote-for-reform-map/us-congress-114.json")
    .await(ready);

function ready(error, us, congress) {
  if (error) return console.error(error);

    var map_width   = $('#container_div').width(),
        map_height  = $('#container_div').width() * 4 / 9 ;

    var projection = d3.geo.albersUsa()
        .scale(map_width)
        .translate([map_width / 2, map_height / 2]);

    var path = d3.geo.path()
        .projection(projection);

    var g = d3.select("svg")
        .attr("width", map_width)
        .attr("height", map_height);

  var draw = {};

  draw.senate = function() {
      g.selectAll('g').remove();

      g.append("g")
          .attr("class", "states")
        .selectAll("path")
          .data(topojson.feature(us, us.objects.states).features)
        .enter().append("path")
          .attr("class", function(d) { return code_district(d); })
          // .on('mouseenter', show_candidates)
          // .on('mouseleave', show_default)
          .on('click', show_candidates)
          .attr("d", path);
  }

  draw.house = function() {
      g.selectAll('g').remove();

      g.append("g")
          .attr("class", "districts")
          .attr("clip-path", "url(#clip-land)")
        .selectAll("path")
          .data(topojson.feature(congress, congress.objects.districts).features)
        .enter().append("path")
          .attr("class", function(d) { return code_district(d); })
          // .on('mouseenter', show_candidates)
          // .on('mouseleave', show_default)
          .on('click', show_candidates)
          .attr("d", path);

      g.append("path")
          .attr("class", "district-boundaries")
          .datum(topojson.mesh(congress, congress.objects.districts, function(a, b) { return a !== b && (a.id / 1000 | 0) === (b.id / 1000 | 0); }))
          .attr("d", path);
  }

  draw.senate();

  $('.map-control li a').click(function() {
    console.log(this, $(this).data('chamber'))
    draw[$(this).data('chamber')]();
    $(this).parents('.map-control').find('li').removeClass('active');
    $(this).parent().addClass('active');
  });

  d3.select(self.frameElement).style("height", map_height + "px");
}
