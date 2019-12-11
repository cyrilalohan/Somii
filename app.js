var config = require('./config');
var twit = require('twit');
var T = new twit(config);

var params = {
	q: 'lol OR lmao OR 😂 since:2019-12-09',
	count: 15,
    lang: 'en'
}

function findAndRetweet(){
	T.get('search/tweets', params, function(err, data, response) {
		var tweets = data.statuses;
		if(!err){
			tweets.forEach(function(tweet){
				// if tweet is op, retweet or like
				if(!tweet.in_reply_to_status_id_str && tweet.favorite_count > 8){
					T.post('statuses/retweet/:id', { id: tweet.id_str }, function (err, data, response){
						if(response){
							console.log('Retweeted a tweet!');
						}
					});
				}
				// if tweet is a reply, find parent tweet and retweet or like
				if(tweet.in_reply_to_status_id_str && tweet.favorite_count > 1){
					T.post('statuses/retweet/:id', { id: tweet.in_reply_to_status_id_str }, function (err, data, response){
						if(response){
							console.log('Retweeted a tweet!');
						}
					});
				}
			});
		}
	});
}

setInterval(findAndRetweet, 60000);