module.exports = (router, db, mongojs, config, google, jwt) => {
	const oauth2Client = new google.auth.OAuth2(
		process.env.CLIENT_ID || config.CLIENT_ID,
		process.env.CLIENT_SECRET || config.CLIENT_SECRET,
		process.env.REDIRECT_URL || config.REDIRECT_URL
	);

	/**
	 * @swagger
	 * /login:
	 *   get:
	 *     tags:
	 *       - login
	 *     name: login
	 *     summary: Use Google Open ID to login to the system. If the account does not exist, it will be created based on login info retrieved from Google.
	 *     produces:
	 *       - application/json
	 *     responses:
	 *       200:
	 *         description: Successful login
	 *       400:
	 *           description: Invalid user request.
	 *       500:
	 *         description: Something is wrong with service please contact system administrator
	 */

	router.get("/login", (req, res) => {
		let code = req.query.code;
		if (code) {
			oauth2Client.getToken(code).then(result => {
				oauth2Client.setCredentials({ access_token: result.tokens.access_token });
				let oauth2 = google.oauth2({
					auth: oauth2Client,
					version: "v2"
				});

				oauth2.userinfo.get((err, response) => {
					if (err) {
						res.status(400).json({ message: `Update failed. Reason: ${err.errmsg}` });
					}
					let data = response.data;

					db.users.findAndModify(
						{
							query: { email: data.email },
							update: {
								$setOnInsert: { email: data.email, name: data.name, signup_time: new Date(), type: "customer" }
							},
							new: true,
							upsert: true
						},
						(error, doc) => {
							if (error) {
								console.log(error);
							}
							let jwtToken = jwt.sign(
								{
									...data,
									//exp: Math.floor(Date.now() / 1000) + 3600,
									id: doc._id,
									type: doc.type
								},
								process.env.JWT_SECRET || config.JWT_SECRET
							);
							res.json({ jwt: jwtToken });
						}
					);
				});
			});
		} else {
			const scopes = [
				"https://www.googleapis.com/auth/userinfo.profile",
				"https://www.googleapis.com/auth/userinfo.email"
			];

			const url = oauth2Client.generateAuthUrl({
				access_type: "online",
				scope: scopes
			});
			res.redirect(url);
		}
	});
};
