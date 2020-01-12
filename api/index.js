const express = require("express");
const mongojs = require("mongojs");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { google } = require("googleapis");
const cors = require("cors");
const path = require('path');

let config;

if (!process.env.HEROKU) {
	config = require("./config");
}
const app = express();
const port = process.env.PORT || 3001;

const db = mongojs(process.env.MONGODB_URL || config.MONGODB_URL);

app.use(bodyParser.json());

// app.use(cors());

app.use((req, res, next) => {
	console.log("Server time: ", Date.now());
	next();
});

let admin_router = express.Router();
require("./routes/admin/admin.js")(admin_router, db, mongojs, jwt, config, express, swaggerJSDoc, swaggerUi);
app.use("/admin", admin_router);

let customer_router = express.Router();
require("./routes/customer/customer.js")(customer_router, db, mongojs, jwt, config, express);
app.use("/customer", customer_router);

let public_router = express.Router();
require("./routes/public/public.js")(public_router, db, mongojs, express, config, google, jwt);
app.use(public_router);

app.use('/', express.static('./../frontend/build'));
app.get('/*', function (req, res) {
	res.sendFile(path.join(__dirname, './../frontend/build/index.html'), function (err) {
		if (err) {
			res.status(500).send(err)
		}
	})
})

app.listen(port, () => {
	console.log("Server listening on port :" + port);
});
