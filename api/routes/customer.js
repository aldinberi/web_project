module.exports = (router, db, mongojs, jwt, config) => {
	router.use((req, res, next) => {
		console.log(`Customer route accessed by: ${req.ip}`);

		let authorization = req.get("Authorization");
		if (authorization) {
			jwt.verify(authorization, process.env.JWT_SECRET || config.JWT_SECRET, (error, decoded) => {
				if (error) {
					res.status(401).send({ message: "Unauthorized access: " + error.message });
				} else {
					let userType = decoded.type;
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
};
