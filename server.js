/******************************************************
 * PLEASE DO NOT EDIT THIS FILE
 * the verification process may break
 * ***************************************************/

'use strict';

var fs = require('fs');
var express = require('express');
var url = require("url");
var strftime = require("strftime");
var app = express();

if (!process.env.DISABLE_XORIGIN) {
  app.use(function(req, res, next) {
    var allowedOrigins = ['https://narrow-plane.gomix.me', 'https://www.freecodecamp.com'];
    var origin = req.headers.origin || '*';
    if(!process.env.XORIG_RESTRICT || allowedOrigins.indexOf(origin) > -1){
         console.log(origin);
         res.setHeader('Access-Control-Allow-Origin', origin);
         res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
    next();
  });
}

app.use('/public', express.static(process.cwd() + '/public'));

app.route('/_api/package.json')
  .get(function(req, res, next) {
    console.log('requested');
    fs.readFile(__dirname + '/package.json', function(err, data) {
      if(err) return next(err);
      res.type('txt').send(data.toString());
    });
  });

function getTime(data) {
  var res = {"unix":null, "natural": null};
  console.log(data.path.slice(1).split("%20").join(" "));
  try {
    var date = new Date(data.path.slice(1).split("%20").join(" "));
    res.unix = date.getTime();
    res.natural = strftime("%B %d, %Y", date);
  } catch (err) {
    
  }
  return res;
}
  
app.route('/')
    .get(function(req, res) {
		  res.sendFile(process.cwd() + '/views/index.html');
    });

app.route('/:date')
    .get(function(req, res) {
      var reqData = url.parse(req.url, true);
      
      res.send(getTime(reqData));
})


// Respond not found to all the wrong routes
app.use(function(req, res, next){
  res.status(404);
  res.type('txt').send('Not found');
});

// Error Middleware
app.use(function(err, req, res, next) {
  if(err) {
    res.status(err.status || 500)
      .type('txt')
      .send(err.message || 'SERVER ERROR');
  }  
})

app.listen(process.env.PORT, function () {
  console.log('Node.js listening ...');
});

