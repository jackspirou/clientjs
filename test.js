var util  = require('util'),
    spawn = require('child_process').spawn,
    karma;

if (process.env.CI || process.env.DRONE) {
  karma = spawn('karma', ['start', 'karma.conf-ci.js'])
} else {
  karma = spawn('karma', ['start', 'karma.conf.js'])
}

karma.stdout.on('data', function (data) {
  process.stdout.write(data);
});
karma.stderr.on('data', function (data) {
  process.stdout.write(data);
});
karma.on('exit', function (code) {
  process.exit(code)
});
