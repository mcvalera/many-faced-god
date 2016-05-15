// curl 'https://www.pilipinaselectionresults2016.com/data/regions/root.json' -H 'accept-encoding: gzip, deflate, sdch' -H 'accept-language: en-US,en;q=0.8' -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36' -H 'accept: application/json, text/plain, */*' -H 'referer: https://www.pilipinaselectionresults2016.com/' -H 'cookie: __cfduid=d1effd6900a24380b69c89e7b32b97df01463208405; cf_clearance=a0087d1142fa5cfdc8a558fc6c9ae89faf2c1371-1463281682-3600; _gat=1; _ga=GA1.2.1085818165.1463208410' --compressed

var request = require('request');
var async = require('async');
var _ = require('lodash');
var knex = require('knex')(require('./knexfile.js'));

var headers = {
	cookie: '__cfduid=d1effd6900a24380b69c89e7b32b97df01463208405; _ga=GA1.2.1085818165.1463208410; cf_clearance=d7ff36dbb1ed6d6dc9c120bd65267878864dc308-1463300001-3600', 
	'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36',
	accept: 'application/json, text/plain, */*'
}
var baseUrl = 'https://www.pilipinaselectionresults2016.com/';
var regionQ = async.queue(function(url, callback) {

	console.log(url);

	request.get({ 
		url: baseUrl + url,
		json: true,
		headers: headers
	}, function(error, response, body) {

    if (response.statusCode !== 200) {
      console.log('error');
      return callback();
    }

		var regions = body.subRegions;

		if (_.isEmpty(regions)) {
			var contests = body.contests;
			for (var i = 0; i < 3; i++) { // up to senators
				votesQ.push({ 
          url: contests[i].url,
          regionId: body.customCode
        });
			}
		} else {
			for (var key in  regions) {
				regionQ.unshift(regions[key].url);
			}
		}

    knex('regions').insert({
      id: body.customCode,
      name: body.name,
      type: body.categoryName,
      parent_region_id: body.parentRegionCC
    }).then(function(results) {
      callback();
    }).catch(callback);

	});

});

regionQ.push('data/regions/root.json');

var votesQ = async.queue(function(obj, callback) {
  var url = obj.url;
  var regionId = obj.regionId;

	console.log(url);

	request.get({ 
		url: baseUrl + url,
		json: true,
		headers: headers
	}, function(error, response, body) {

    if (!body.results) { return callback() }

    knex('votes').insert(
  	  body.results.map(function(result) {
        return {
          candidate_id: result.canCode,
          percentage: result.percentage,
          count: result.votes,
          region_id: regionId
        };
      })
    ).then(function(results) {
      callback();
    }).catch(callback);

    body.results.forEach(function(candidate) {
      knex('candidates').where({ id: candidate.canCode }).count().then(function(count) {
        if (count[0].count === '0') { 
          knex('candidates').insert({
            id: candidate.canCode,
            name: candidate.bName,
            contest: body.name
          }).then(function() {});
        }
      })
    });

	});

});
