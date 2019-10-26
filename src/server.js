const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

app.get('/ping', function (req, res) {
 return res.send('pong');
});

app.get('/', function (req, res) {
  res.send("Hello Express");
});

app.listen(port, ()=>{
    console.log("Server listening on port:" +port);
});