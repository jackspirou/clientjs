var spawn = require('child_process').spawn;
var karma;

if (process.env.CI || process.env.DRONE) {

  if (process.env.DRONE_BRANCH == 'master') {
    process.env.SAUCE_USERNAME = process.env.PRIMARY_SAUCE_USERNAME;
    process.env.SAUCE_USERNAME = process.env.PRIMARY_SAUCE_ACCESS_KEY;
  }else {
    process.env.SAUCE_USERNAME = process.env.SECONDARY_SAUCE_USERNAME;
    process.env.SAUCE_USERNAME = process.env.SECONDARY_SAUCE_ACCESS_KEY;
  }

  karma = spawn('./node_modules/karma/bin/karma', ['start', 'karma/drone.conf.js']);
} else {
  karma = spawn('./node_modules/karma/bin/karma', ['start', 'karma/local.conf.js']);
}

karma.stdout.on('data', function (data) {
  process.stdout.write(data);
});

karma.stderr.on('data', function (data) {
  process.stdout.write(data);
});

karma.on('exit', function (code) {
  process.exit(code);
});
