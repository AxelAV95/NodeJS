//npm install newman --save-dev
//npm install newman-reporter-html

//npm install newman@4 --save-dev
//npm install newman-reporter-html --save-dev

const newman = require('newman');

newman.run({
    collection: require('./userServiceCollection.json'),
    environment: require('./globals.json'),
    reporters: ['cli', 'html'],
    reporter: {
        html: {
            export: './reports/report.html'
        }
    }
}, function (err) {
    if (err) { throw err; }
    console.log('Collection run complete!');
});