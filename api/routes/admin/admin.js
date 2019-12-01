module.exports = (router, db, mongojs, jwt, config, express, swaggerJSDoc, swaggerUi) => {
	router.use((req, res, next) => {
		console.log(`Admin route accessed by: ${req.ip}`);
		console.log(req.path);
		if (req.path.includes("api-docs")) {
			next();
		} else {
			let authorization = req.get("Authorization");
			if (authorization) {
				jwt.verify(authorization, process.env.JWT_SECRET || config.JWT_SECRET, (error, decoded) => {
					if (error) {
						res.status(401).send({ message: "Unauthorized access: " + error.message });
					} else {
						let userType = decoded.type;
						console.log(userType);
						if (userType === "admin") {
							next();
						} else {
							res.status(401).send({ message: "Unauthorized access: improper privileges" });
						}
					}
				});
			} else {
				res.status(401).send({ message: "Unauthorized access." });
			}
		}
	});

	let product_router = express.Router();
	require("./product.js")(product_router, db, mongojs);
	router.use(product_router);

	let cupon_router = express.Router();
	require("./cupon.js")(cupon_router, db, mongojs);
	router.use(cupon_router);

	let store_router = express.Router();
	require("./store.js")(store_router, db, mongojs);
	router.use(store_router);

	let swagger_router = express.Router();
	require("./swagger.js")(swagger_router, config, swaggerJSDoc, swaggerUi);
	router.use(swagger_router);
};
