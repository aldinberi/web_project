const express = require('express');
const mongojs = require('mongojs');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const swaggerrJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

let config;

if(!process.env.HEROKU){
    config = require('./config');
}
const app = express();
const port =  process.env.PORT || 3000;

const db = mongojs(process.env.MONGODB_URL || config.MONGODB_URL);

const swaggerDefinition = {
    info:{
        title: 'GranApp Swagger API Documentation',
        version: '1.0.0'
    },
    host: process.env.SWAGGER_HOST || config.SWAGGER_HOST,
    basePath:'/',
    securityDefinitions: {
        bearerAuth:{
            type:'apiKey',
            name:'Authorization',
            scheme:'bearer',
            in:'header'
        }
    }
};

const options = {
swaggerDefinition,
apis: [
    './index.js',
    './routes/*.js',
    './models/*.js'
]
};

const swaggerSpec = swaggerrJSDoc(options);

app.use(express.static('public'));
app.use(bodyParser.json());

app.use((req,res, next) => {
    console.log('Server time: ', Date.now());
    next();
});

let admin_router = express.Router();
require('./routes/admin/admin.js')(admin_router, db, mongojs, jwt, config);
app.use('/admin', admin_router);

let customer_router = express.Router();
require('./routes/customer.js')(customer_router, db, mongojs, jwt, config);
app.use('/customer', customer_router);

let public_router = express.Router();
require('./routes/public.js')(public_router, db, mongojs)
app.use('/public', public_router);



const {google} = require('googleapis');
const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID || config.CLIENT_ID,
    process.env.CLIENT_SECRET || config.CLIENT_SECRET,
    process.env.REDIRECT_URL || config.REDIRECT_URL
);

app.get('/swagger.json', (req, res)=>{
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/login', (req, res) => {
    let code = req.query.code;
    if (code) {
      oauth2Client.getToken(code).then((result) => {
          oauth2Client.setCredentials({access_token: result.tokens.access_token});
          let oauth2 = google.oauth2({
              auth: oauth2Client,
              version: 'v2'
          });
          
          oauth2.userinfo.get((err, response) => {
              if (err) {
                  throw err;
              }
              let data = response.data;

              db.users.findAndModify({ 
                  query: { email: data.email },
                  update: { $setOnInsert: { email: data.email, name: data.name, signup_time: new Date(), type: 'customer' } },
                  new: true,
                  upsert: true  
              }, (error, doc) => {
                  if (error) {
                      console.log(error);
                  }
                  let jwtToken = jwt.sign({
                      ...data,
                      exp: (Math.floor(Date.now() / 1000) + 3600),
                      id: doc._id,
                      type: doc.type
                  }, process.env.JWT_SECRET || config.JWT_SECRET);
                  res.json({ 'jwt' : jwtToken });
              });
          });
      });
    } else {
      const scopes = [
          'https://www.googleapis.com/auth/userinfo.profile',
          'https://www.googleapis.com/auth/userinfo.email'
      ];
      
      const url = oauth2Client.generateAuthUrl({
          access_type: 'online',
          scope: scopes
      });
      res.redirect(url);
    }
});


app.listen(port, () => {
    console.log('Server listening on port :' + port);
});


