//Install express server
const express = require('express');

//var crypto = require('crypto');
//var path = require('path');
//
//var s3 = require('./src/assets/libs/js/s3');
//
//var s3Config = {
//  accessKey: 'AKIAJ3EJET7YPGN22TOQ',
//  secretKey: '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',
//  bucket: 'cosmeticmarket',
//  region: 'us-east-1'
//};

const app = express();

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist'));

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/dist/index.html');
});

// for uploading images
//app.get('/s3_credentials', function(request, response) {
//  if (request.query.filename) {
//    var filename =
//      crypto.randomBytes(16).toString('hex') +
//      path.extname(request.query.filename);
//    response.json(s3.s3Credentials(s3Config, {filename: filename, contentType: request.query.content_type}));
//  } else {
//    response.status(400).send('filename is required');
//  }
//});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
