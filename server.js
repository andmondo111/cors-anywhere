// Listen on a specific host via the HOST environment variable
var host = process.env.PORT ? '0.0.0.0' : '127.0.0.1';
// Listen on a specific port via the PORT environment variable
var port = process.env.PORT || 8080;

// Grab the blacklist from the command-line so that we can update the blacklist without deploying
// again. CORS Anywhere is open by design, and this blacklist is not used, except for countering
// immediate abuse (e.g. denial of service). If you want to block all origins except for some,
// use originWhitelist instead.
var originBlacklist = parseEnvList(process.env.CORSANYWHERE_BLACKLIST);
var originWhitelist = parseEnvList(process.env.CORSANYWHERE_WHITELIST);
function parseEnvList(env) {
  if (!env) {
    return [];
  }
  return env.split(',');
}

var cors_proxy = require('./lib/cors-anywhere');
cors_proxy.createServer({
  setHeaders: {"origin": "https://www.twitch.tv"},
  requireHeader: [],
  removeHeaders: [
      'cookie',
      'cookie2',
      // Strip Heroku-specific headers
      'x-heroku-queue-wait-time',
      'x-heroku-queue-depth',
      'x-heroku-dynos-in-use',
      'x-request-start'
  ],
  httpProxyOptions: {
    // Do not add X-Forwarded-For, etc. headers, because Heroku already adds it.
    xfwd: false
  }
}).listen(port, host, function() {
  console.log('Running CORS Anywhere on ' + host + ':' + port);
});
