---
layout: post

title: Setup Gulp to open Karma debug page directly

excerpt: "Configure Gulp and Karma to only open the debug.html page"

---

By default Karma doesn't open the debug page directly and it doesn't have a
setting to only open the debug page.

When default Karma configuration to run the tests in a browser instance is a bit annoying because it requires the user to keep clicking the debug button - which opens a new tab and eventually starts running the tests. Instead I would like Gulp to only open the debug.html page directly when the Gulp task starts.

The following setup allows that:

- We'll need browser sync
- In Karma config don't specify any browsers to launch automatically because we'll use browser-sync for that.
Thus in `karma.conf.js` set `browsers: []`
- Add a few lines of code in your gulpfile to dynamically capture the url address of Karma's web server

{% highlight javascript %}
var karmaInstance = new KarmaServer(karmaConfig, _onKarmaExit);

// get Karma's web server instance
var karmaWebServer = karmaInstance.get('webServer');

// listen on listening event and grab the address to pass to browserSync
karmaWebServer.on('listening', _getConnectionDetails);
{% endhighlight %}

{% highlight javascript %}
function _getConnectionDetails() {
  var connectionDetails = karmaWebServer.address();
  var debugAddress = [
    'http://localhost:',
    connectionDetails.port,
    '/debug.html'
  ].join('');

  _startBrowserSync(debugAddress);
}
{% endhighlight %}

- Pass the address to browser-sync and open a browser instance

## Running the project
1. `git clone git@github.com:efidiles/karma-debug-with-browser-sync.git karma-debug-with-browser-sync`
2. `npm install`
3. `npm test`

Karma's `/debug.html` will now open in your browser.

## Github link
<a href="https://github.com/efidiles/karma-debug-with-browser-sync" target="_blank">https://github.com/efidiles/karma-debug-with-browser-sync</a>
