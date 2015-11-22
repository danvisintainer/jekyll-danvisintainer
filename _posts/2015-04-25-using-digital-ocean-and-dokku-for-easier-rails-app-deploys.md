---
title: Using Digital Ocean and Dokku for easier Rails app deploys
author: danvisintainer
layout: post
date:   2015-04-25 21:52:32
categories:
  - Uncategorized
---
Heroku is a great service. It’s powering some of my projects as I type this. You cannot knock it for its ease of use in deploying web apps in many of today’s popular programming languages.

Unfortunately, Heroku’s free packages aren’t without limits. For example, [support for temporary file storage is really tricky.][3] There’s also [limited database storage][4].

Add all of these limitations together, and you may just wish you could host your app on your own server &#8211; there wouldn’t be any limits there! Now, setting up your own server requires a lot of technical elbow grease and know-how. And once you get that done, deploying your app is a whole other step. If only there was an easier way!

Thankfully, there is. Enter [Dokku][5].

## You say Heroku, I say Dokku

To give an extremely broad description of it, Dokku is a self-hosted Heroku. You can deploy your app using Git, just like Heroku, but you don’t have to deal with any of the limitations that come with free Heroku &#8211; since it’s running on your own server, the only limitations are those of your server.

Here, I’ll walk you through getting a Ruby on Rails application up and running with Dokku. We’ll use [Digital Ocean][6] for the servers. I’ll assume you already have a Rails app made, that uses Postgres for its database, and that you have a Digital Ocean account. I also recommend you already have a personalized domain name (applying a subdomain to your Dokku app will work fine as well).

## 1. Make your Droplet

Log into Digital Ocean and make a new Droplet. I recommend a droplet with at least 1GB of RAM (the $10/month one). Scroll down to the “Select Image” section, click the “Applications” tab, and select the “Dokku” image, like so:

<img src="http://www.danvisintainer.com/wp-content/uploads/2015/04/4-1024x819.jpg" alt="Digital Ocean&#039;s images" width="1000" height="800" class="aligncente size-large wp-image-24" />

The Dokku image will give you a server droplet with Dokku pre-installed for you. Next, click “Create Droplet”.

## 2. Add your SSH key to Dokku

Once your droplet is created, you’ll get an email from Digital Ocean with your droplet’s IP address. Navigate to it in your web browser. You’ll see this screen:

<img src="http://www.danvisintainer.com/wp-content/uploads/2015/04/1-1024x903.jpg" alt="The Dokku initial setup screen" width="1000" height="882" class="alignnone size-large wp-image-21" />

First, you’ll need to copy your computer’s public SSH key. Go to your terminal and run this:

<pre class="brush: bash; title: ; notranslate" title="">$ cat /.ssh/idrsa.pub
</pre>

Copy what was printed and paste it into the text box labeled “Public Key”.

Next, type your domain name (without “www”) into the “Hostname” box.

I recommend you check “Use virtualhost naming for apps” &#8211; if you don’t, Dokku will generate a new port every time your app is booted. Click “Finish Setup.”

## 3. Add the Git remote

Next is to add the Git remote so we can deploy your app to your Dokku server. In your terminal, navigate to your app directory and run this:

<pre class="brush: bash; title: ; notranslate" title="">$ git remote add dokku dokku@[server IP]:[app name]
</pre>

`[app name]` is where you&#8217;ll name your app &#8211; this can be whatever you like, and it&#8217;s not necessarily a name that would already be defined. Make note of it, though, as you&#8217;ll need it later.

You can now push to Dokku, like so:

<pre class="brush: bash; title: ; notranslate" title="">$ git push dokku master
</pre>

If you’ve used Heroku before, you may find that Dokku’s output looks familiar:

<img src="http://www.danvisintainer.com/wp-content/uploads/2015/04/2-1024x512.jpg" alt="Dokku&#039;s output" width="1000" height="500" class="alignnone size-large wp-image-22" />

## 4. Get your database working

If your app uses Postgres, you’ll need to set up your database on the server end. Let’s connect to your server with SSH. Go back to your droplet email from Digital Ocean, and make note of your server IP and root password. Then, head to your terminal and SSH to your server:

<pre class="brush: bash; title: ; notranslate" title="">$ ssh root@[your server IP]
</pre>

Next, we’ll install Postgres. Run these commands:

<pre class="brush: bash; title: ; notranslate" title="">$ cd /var/lib/dokku/plugins
$ git clone https://github.com/Kloadut/dokku-pg-plugin postgresql
$ dokku plugins-install
</pre>

Your server may take a minute or two to run these. When it’s done, create your database:

<pre class="brush: bash; title: ; notranslate" title="">$ dokku postgresql:create
</pre>

This command will output some info, but you don’t actually need any of it. We’ll link the DB ourselves here:

<pre class="brush: bash; title: ; notranslate" title="">$ dokku postgresql:link [your app name] [the database name you want]
</pre>

Next, let’s migrate:

<pre class="brush: bash; title: ; notranslate" title="">$ dokku run [your app name] rake:db migrate
</pre>

And with that, your database is good to go.

## 5. Set your API keys if you have them

Finally, if your app uses API keys that are ignored with Git (perhaps you’re using figaro or something), they’ll need to be added to your environment on Dokku. Fortunately, this is easy to do.

In your terminal and while connected to your server with SSH, run this command to add an environment variable. If you’ve used Heroku before, it may look familiar:

<pre class="brush: bash; title: ; notranslate" title="">$ dokku config:set [your app name] TWITTER_KEY=ThisIsTotallyMyTwitterAPIKeySeriously738rh43723bd
</pre>

## 6. Enjoy

That should be all you need to get your app working on Dokku! You can now enjoy easier, simpler deploys, automatically-installed Rails gems, with no database or file limitations to be found.

 [1]: http://markytwit.herokuapp.com
 [2]: http://colorfulnyc.herokuapp.com
 [3]: https://devcenter.heroku.com/articles/read-only-filesystem
 [4]: https://devcenter.heroku.com/articles/heroku-postgres-plans
 [5]: https://github.com/progrium/dokku
 [6]: http://www.digitalocean.com