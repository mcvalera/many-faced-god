// curl 'https://www.pilipinaselectionresults2016.com/data/regions/root.json' -H 'accept-encoding: gzip, deflate, sdch' -H 'accept-language: en-US,en;q=0.8' -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36' -H 'accept: application/json, text/plain, */*' -H 'referer: https://www.pilipinaselectionresults2016.com/' -H 'cookie: __cfduid=d1effd6900a24380b69c89e7b32b97df01463208405; cf_clearance=a0087d1142fa5cfdc8a558fc6c9ae89faf2c1371-1463281682-3600; _gat=1; _ga=GA1.2.1085818165.1463208410' --compressed

var request = require('request');
var async = require('async');
var _ = require('lodash');

var headers = {
	cookie: '__cfduid=d1effd6900a24380b69c89e7b32b97df01463208405; cf_clearance=60e051bf9aa122bbbfabac9e3de77877b99e0162-1463285492-3600; _gat=1; _ga=GA1.2.1085818165.1463208410', 
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
		var regions = body.subRegions;

		debugger
		if (_.isEmpty(regions)) {
			var contests = body.contests;
			for (var i = 0; i < 4; i++) { // up to party lists
				votesQ.push(contests[i].url);
			}
		} else {
			for (var key in  regions) {
				regionQ.unshift(regions[key].url);
			}
		}

		callback();

	});

});

regionQ.push('data/regions/root.json');

var votesQ = async.queue(function(url, callback) {

	console.log(url);

	request.get({ 
		url: baseUrl + url,
		json: true,
		headers: headers
	}, function(error, response, body) {
		
		callback();

	});

});
