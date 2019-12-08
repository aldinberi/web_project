module.exports = (router, db, mongojs, jwt, config, express) => {
	router.use((req, res, next) => {
		console.log(`Customer route accessed by: ${req.ip}`);

		let authorization = req.get("Authorization");
		if (authorization) {
			jwt.verify(authorization, process.env.JWT_SECRET || config.JWT_SECRET, (error, decoded) => {
				if (error) {
					res.status(401).send({ message: "Unauthorized access: " + error.message });
				} else {
					let userType = decoded.type;
					console.log(userType);
					if (userType === "customer" || userType === "admin") {
						next();
					} else {
						res.status(401).send({ message: "Unauthorized access: improper privileges" });
					}
				}
			});
		} else {
			res.status(401).send({ message: "Unauthorized access." });
		}
	});

	let shopping_cart_router = express.Router();
	require("./shopping_cart.js")(shopping_cart_router, db, mongojs);
	router.use(shopping_cart_router);
};
