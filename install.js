// Creates sauce.json if not yet present after install
var fs = require('fs');

if (!fs.existsSync('sauce.json')) {
    fs.writeFileSync('sauce.json', fs.readFileSync('sauce-sample.json'));
}
