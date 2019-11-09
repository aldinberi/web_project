const express = require('express');
const mongojs = require('mongojs');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

let config;

if(!process.env.HEROKU){
    config = require('./config');
}
const app = express();
const port =  process.env.PORT || 3000;

const db = mongojs(process.env.MONGODB_URL || config.MONGODB_URL);

app.use(express.static('public'));
app.use(bodyParser.json());

app.use((req,res, next) => {
    console.log('Server time: ', Date.now());
    next();
});

let admin_router = express.Router();
require('./routes/admin.js')(admin_router, db, mongojs, jwt, config);
app.use('/admin', admin_router);

let public_router = express.Router();
require('./routes/public.js')(public_router, db, mongojs)
app.use('/public', public_router);


app.listen(port, () => {
    console.log('Server listening on port :' + port);
});


