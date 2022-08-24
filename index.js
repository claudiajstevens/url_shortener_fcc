require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

//added
const bodyParser = require('body-parser');
global.longURLs = [];
var dns = require('dns');


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});


app.use(bodyParser.urlencoded({extended: false}));

//You can POST a URL to /api/shorturl and get a JSON response with original_url and short_url properties. Here's an example: { original_url : 'https://freeCodeCamp.org', short_url : 1}
//When you visit /api/shorturl/<short_url>, you will be redirected to the original URL.
app.post("/api/shorturl", function(req, res){
  let longURL = req.body.url;
  const urlObj = new URL(longURL);
  let myJSON = {"original_url":"", "short_url":""};
  

  let validated = dns.lookup(urlObj.hostname, (err, addresses, family) => {
    if(err){
      myJSON = {
        error: 'invalid url'
      }
    }else{
      longURLs.push(longURL);
      myJSON.original_url = longURL;
      myJSON.short_url = longURLs.indexOf(longURL);
    }
    res.json(myJSON);
  });
  
});

//When you visit /api/shorturl/<short_url>, you will be redirected to the original URL.
app.get("/api/shorturl/:url", function(req, res){
  console.log(req.params.url);
  console.log(longURLs[req.params.url]);
  res.writeHead(307, {
    Location: longURLs[req.params.url]
  }).end();
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});




