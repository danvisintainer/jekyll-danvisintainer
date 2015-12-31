---
title: Adventures in API-Land
layout: post
---
I think I worked myself up a little too much last week. I’d later find that others agreed, as several of my classmates at [Flatiron School](http://www.flatironschool.com) suggested that I lay low this weekend, and try not coding at all.

So, me in my infinite wisdom (is “infinite” the right word?), did the exact opposite &#8211; I made two Twitter web apps, and one for Instagram. They’re all quite simple and I’m fairly certain that other (and better) versions of these exist on the Internet, but I’ve always been interested in connecting with some of my favorite social networks.

<!-- more -->

You can visit the sites below (note that colorful#NYC is very slow), but I wanted to talk about what to expect when using API calls.

[MarkyTwit][2] &#8211; a silly little app that blurts “probable tweets” by generating Markov chains from the tweets of a given user.  
[WTFSIUOT][3] &#8211; an even sillier little app (that uses very colorful language) that suggests who you should unfollow from Twitter, based on how often your followers tweet during the day.  
[colorful#NYC][4] &#8211; **give it time to run if you try this as it&#8217;s currently very slow** &#8211; an Instagram-powered app that groups NYC pictures by color. Ended up biting off much, much more than I can chew with this one. (I’d like this up and running on Heroku once I figure out [mini_magick][5])

## Why, Must I API?

Imagine you’re making a Twitter client of your own, and you’d like to pull the latest tweets and display them in your app. You could use the great Nokogiri gem, but that scrapes directly from the page’s source, meaning that if the site changes its layout, your program may break. That’s where APIs come in.

“API” stands for **Application Program Interface**. To keep things simple, an API allows apps to talk to services directly. We can push and pull information with them and not have to use a page scraper or some kind of middle-man. If you’re requesting information from a service, and it has an API that you can freely use, you should use it.

Normally, you would get / set data with HTTP requests. If you use Ruby, though, you’ll be happy to hear that [there’s a great Twitter gem for this][6], and [Instagram even has an official one][7]! Now you just have to figure out how to use it.

## Read Up

Each API is used differently. Calling `Instagram#user_media_feed` will return an array of key-labeled hashes with links and bits of text inside. Using `Twitter#user_timeline("DViz")` will give you an array of Tweet objects, each with their own methods. Wait, that method only returns 200 tweets? What if I want to fetch more? What does “Rate Limit Exceeded” mean? What’s happening?!

It’s easy to get lost, and there’s only one thing you can do to solve it: **Read the API’s documentation.** The Ruby gems handle the HTTP requests for you, but many of these requests can have options attached &#8211; for example, perhaps you only want to fetch 20 tweets at once, or search for Instagram posts with certain tags.

Another big suggestion I have is to **just explore, play around with it, fail, and turn to Google if you need help.** Did you know that [Instagram’s official documentation advises you to use a function that their Ruby gem says is deprecated][8]? Neither did I until I searched about it.

## Some random tips about APIs

  * `Twitter#user_timeline("username")` will return up to 200 tweets for that user, but that doesn’t mean you can’t pull more. Store them in an array. Then, make the API call again, only this time set `max_id` to the ID of the last tweet. If you’re using Ruby, you may come up with something like this: 
    client.user\_timeline(“username”, {max\_id = array.last.[:id][9])
    
    Instagram works in a similar way, only the post’s ID is set to string of numbers with an underscore in the middle that’s supposed to represent a point in time, and not an integer.

  * Know your rate limits &#8211; meaning, how many API calls a service will allow you to make within a certain period of time. Instagram allows for 5000 requests per hour. Twitter allows for 150.

## Other Random Bits of Information You May Find Useful

  * Rails and ActiveRecord go hand-in-hand, but that doesn’t mean they have to. In fact, if you build a Rails app that depends on ActiveRecord, you may run into some trouble when deploying it to Heroku (I know this because I did). Luckily, you can create a Rails app that doesn’t include ActiveRecord at all, like so:
    
    <pre class="brush: ruby; title: ; notranslate" title="">rails new app_name -O</pre>

  * Supposedly, there is no way to store temporary files on a Heroku slice (using a free slice, anyway), so I had to move colorful#NYC to DigitalOcean. I also realized my Photoshop skills in the making of that site (I have zero Photoshop skills).

 [2]: http://markytwit.herokuapp.com
 [3]: http://wtfsiuot.herokuapp.com
 [4]: http://colorfulnyc.danvisintainer.com
 [5]: https://github.com/minimagick/minimagick
 [6]: https://github.com/sferik/twitter
 [7]: https://github.com/Instagram/instagram-ruby-gem
 [8]: https://github.com/Instagram/instagram-ruby-gem/issues/65
 [9]: #