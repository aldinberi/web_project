module.exports = (router, db, mongojs) => {
	/**
	 * @swagger
	 * /customer/carts/{user_id}:
	 *   get:
	 *     tags:
	 *       - shopping_cart
	 *     name: getShoppingCart
	 *     summary: Get users cart in system
	 *     parameters:
	 *       - in: path
	 *         name: user_id
	 *         description: ID of the user
	 *         required: true
	 *         type: string
	 *         default: '5dc707a2719a52f7ad39a818'
	 *       - name: offset
	 *         in: query
	 *         description: The offset of the shopping cart list.
	 *         type: integer
	 *         default: 0
	 *       - name: limit
	 *         in: query
	 *         description: The limit of the shopping cart list.
	 *         type: integer
	 *         default: 5
	 *     security:
	 *       - bearerAuth: []
	 *     produces:
	 *       - application/json
	 *     responses:
	 *       200:
	 *         description: Returend list of products in cart
	 *       400:
	 *           description: Invalid user request.
	 *       401:
	 *           description: Unauthorized access.
	 *       500:
	 *         description: Something is wrong with service please contact system administrator
	 */

	router.get("/carts/:user_id", (req, res) => {
		let user_id = req.params.user_id;
		let limit = Number(req.query.limit) || 5;
		let skip = Number(req.query.skip) || 0;
		db.shopping_carts.aggregate(
			[
				{ $match: { user_id: mongojs.ObjectId(user_id) } },
				{ $limit: limit },
				{ $skip: skip },
				{
					$lookup: {
						from: "store_products",
						localField: "store_products_id",
						foreignField: "_id",
						as: "store_products"
					}
				},
				{ $unwind: "$store_products" },
				{ $lookup: { from: "products", localField: "store_products.product_id", foreignField: "_id", as: "product" } },
				{ $unwind: "$product" },
				{ $lookup: { from: "stores", localField: "store_products.store_id", foreignField: "_id", as: "store" } },
				{ $unwind: "$store" },
				{
					$project: {
						product_name: "$product.name",
						price: "$store_products.price",
						store_name: "$store.name",
						store_address: "$store.address"
					}
				}
			],
			(error, docs) => {
				if (error) {
					res.status(400).json({ message: `Retrieving data failed. Reason: ${error.errmsg}` });
				}
				res.json(docs);
			}
		);
	});

	/**
	 * @swagger
	 * /customer/carts/price/{user_id}:
	 *   get:
	 *     tags:
	 *       - shopping_cart
	 *     name: getShoppingCartPrice
	 *     summary: Get users cart price in system
	 *     parameters:
	 *       - in: path
	 *         name: user_id
	 *         description: ID of the user
	 *         required: true
	 *         type: string
	 *         default: '5dc707a2719a52f7ad39a818'
	 *     security:
	 *       - bearerAuth: []
	 *     produces:
	 *       - application/json
	 *     responses:
	 *       200:
	 *         description: Returned the total price of users cart
	 *       400:
	 *           description: Invalid user request.
	 *       401:
	 *           description: Unauthorized access.
	 *       500:
	 *         description: Something is wrong with service please contact system administrator
	 */

	router.get("/carts/price/:user_id", (req, res) => {
		let user_id = req.params.user_id;
		db.shopping_carts.aggregate(
			[
				{ $match: { user_id: mongojs.ObjectId(user_id) } },
				{ $group: { _id: "$store_products_id", totaly_qunatity: { $sum: "$quantity" } } },
				{
					$lookup: {
						from: "store_products",
						localField: "_id",
						foreignField: "_id",
						as: "store_products"
					}
				},
				{ $unwind: "$store_products" },
				{ $project: { total: { $multiply: ["$store_products.price", "$totaly_qunatity"] } } },
				{ $group: { _id: null, totaly_qunatity: { $sum: "$total" } } }
			],
			(error, docs) => {
				if (error) {
					res.status(400).json({ message: `Retrieving data failed. Reason: ${error.errmsg}` });
				}
				res.json(docs);
			}
		);
	});

	/**
	 * @swagger
	 * /customer/carts:
	 *   post:
	 *     tags:
	 *       - shopping_cart
	 *     name: addToShoppingCart
	 *     summary: Add a new product to users shopping cart
	 *     security:
	 *       - bearerAuth: []
	 *     consumes:
	 *       - application/json
	 *     parameters:
	 *       - in: body
	 *         name: body
	 *         description: Cart object
	 *         required: true
	 *         schema:
	 *             $ref: "#/definitions/Cart"
	 *     responses:
	 *       200:
	 *         description: Returned a new entry in the cart.
	 *       400:
	 *           description: Invalid user request.
	 *       401:
	 *           description: Unauthorized access.
	 *       500:
	 *         description: Something is wrong with the service. Please contact the system administrator.
	 */

	router.post("/carts", (req, res) => {
		req.body.user_id = mongojs.ObjectId(req.body.user_id);
		req.body.store_products_id = mongojs.ObjectId(req.body.store_products_id);
		db.shopping_carts.insert(req.body, (error, docs) => {
			if (error) {
				res.status(400).json({ message: `Insert failed. Reason: ${error.errmsg}` });
			}
			res.json(docs);
		});
	});

	/**
	 * @swagger
	 * /customer/carts/{id}:
	 *   put:
	 *     tags:
	 *       - shopping_cart
	 *     name: updateShoppingCart
	 *     summary: Update item in shopping cart
	 *     security:
	 *       - bearerAuth: []
	 *     consumes:
	 *       - application/json
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         description: ID of the shopping cart item
	 *         required: true
	 *         type: string
	 *         default: '5decf8672d00354e84ade8ee'
	 *       - in: body
	 *         name: body
	 *         description: Cart object
	 *         required: true
	 *         schema:
	 *             $ref: "#/definitions/Cart"
	 *     responses:
	 *       200:
	 *         description: Returned the updated shopping cart object.
	 *       400:
	 *         description: Invalid user request.
	 *       401:
	 *           description: Unauthorized access.
	 *       500:
	 *         description: Something is wrong with the service. Please contact the system administrator.
	 */

	router.put("/carts/:id", (req, res) => {
		let id = req.params.id;
		req.body.user_id = mongojs.ObjectId(req.body.user_id);
		req.body.store_products_id = mongojs.ObjectId(req.body.store_products_id);
		let itemUpdate = req.body;
		db.shopping_carts.findAndModify(
			{
				query: { _id: mongojs.ObjectId(id) },
				update: { $set: itemUpdate },
				new: true
			},
			(error, docs) => {
				if (error) {
					res.status(400).json({ message: `Update failed. Reason: ${error.errmsg}` });
				}
				res.json(docs);
			}
		);
	});

	/**
	 * @swagger
	 * /customer/carts/{id}:
	 *   delete:
	 *     tags:
	 *       - shopping_cart
	 *     name: deleteCartItemById
	 *     summary: Delete cart item from the system by its ID
	 *     security:
	 *       - bearerAuth: []
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *       - name: id
	 *         in: path
	 *         description: ID of the cart item
	 *         required: true
	 *         type: string
	 *         default: '5de3d9059c11b8c773e5809c'
	 *     responses:
	 *       200:
	 *         description: Successfully deletes a single cart item from the system
	 *       400:
	 *           description: Invalid user request.
	 *       401:
	 *           description: Unauthorized access.
	 *       500:
	 *         description: Something is wrong with the service. Please contact the system administrator.
	 */

	router.delete("/carts/:id", (req, res) => {
		let id = req.params.id;
		db.shopping_carts.remove({ _id: mongojs.ObjectId(id) }, [true], (error, docs) => {
			if (error) {
				res.status(400).json({ message: `Delete failed. Reason: ${error.errmsg}` });
			}
			res.json(docs);
		});
	});
};
