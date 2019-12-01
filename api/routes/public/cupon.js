module.exports = (router, db, mongojs) => {
	/**
	 * @swagger
	 * /cupons:
	 *   get:
	 *     tags:
	 *       - cupons
	 *     name: getCupons
	 *     summary: Get all cupons in system
	 *     parameters:
	 *       - name: offset
	 *         in: query
	 *         description: The offset of the cupons list.
	 *         type: integer
	 *         default: 0
	 *       - name: limit
	 *         in: query
	 *         description: The limit of the cupon list.
	 *         type: integer
	 *         default: 5
	 *     security:
	 *       - bearerAuth: []
	 *     produces:
	 *       - application/json
	 *     responses:
	 *       200:
	 *         description: List of all cupons in system
	 *       500:
	 *         description: Something is wrong with service please contact system administrator
	 */

	router.get("/cupons", (req, res) => {
		let limit = Number(req.query.limit) || 5;
		let skip = Number(req.query.skip) || 0;
		db.cupons.aggregate(
			[
				{ $sort: { new_price: 1 } },
				{ $limit: limit },
				{ $skip: skip },
				{ $lookup: { from: "stores", localField: "store_id", foreignField: "_id", as: "store" } },
				{ $lookup: { from: "products", localField: "product_id", foreignField: "_id", as: "product" } },
				{ $unwind: "$store" },
				{ $unwind: "$product" },
				{
					$project: {
						product_name: "$product.name",
						new_price: 1,
						cupon_code: 1,
						store_name: "$store.name",
						store_address: "$store.address"
					}
				}
			],
			(error, docs) => {
				if (error) {
					res.status(400).json({ message: `Retrieving data failed. Reason: ${err.errmsg}` });
				}
				res.json(docs);
			}
		);
	});

	/**
	 * @swagger
	 * /cupons/{id}:
	 *   get:
	 *     tags:
	 *       - cupons
	 *     name: getCuponById
	 *     summary: Get a cupon from the system by its ID
	 *     security:
	 *       - bearerAuth: []
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *       - name: id
	 *         in: path
	 *         description: ID of the cupon
	 *         required: true
	 *         type: string
	 *         default: '5de3d9059c11b8c773e5809c'
	 *     responses:
	 *       200:
	 *         description: List a single cupon from the system
	 *       400:
	 *           description: Invalid user request.
	 *       401:
	 *           description: Unauthorized access.
	 *       500:
	 *         description: Something is wrong with the service. Please contact the system administrator.
	 */

	router.get("/cupons/:id", (req, res) => {
		let id = req.params.id;
		db.cupons.findOne({ _id: mongojs.ObjectId(id) }, (error, docs) => {
			if (error) {
				res.status(400).json({ message: `Retrieving data failed. Reason: ${err.errmsg}` });
			}
			res.json(docs);
		});
	});

	/**
	 * @swagger
	 * /cupons/produt/{id}:
	 *   get:
	 *     tags:
	 *       - cupons
	 *     name: getCuponByProduct
	 *     summary: Get cheapest product price from the system by its ID
	 *     security:
	 *       - bearerAuth: []
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *       - name: id
	 *         in: path
	 *         description: ID of the product
	 *         required: true
	 *         type: string
	 *         default: '5da4bd64eaea926c41e5e629'
	 *     responses:
	 *       200:
	 *         description: List a list of cheapest price for product from the system
	 *       400:
	 *           description: Invalid user request.
	 *       401:
	 *           description: Unauthorized access.
	 *       500:
	 *         description: Something is wrong with the service. Please contact the system administrator.
	 */

	router.get("/cupons/produt/:id", (req, res) => {
		let id = req.params.id;
		db.cupons.aggregate(
			[
				{ $match: { product_id: mongojs.ObjectId(id) } },
				{ $sort: { new_price: 1 } },
				{ $limit: 1 },
				{ $lookup: { from: "stores", localField: "store_id", foreignField: "_id", as: "store" } },
				{ $lookup: { from: "products", localField: "product_id", foreignField: "_id", as: "product" } },
				{ $unwind: "$store" },
				{ $unwind: "$product" },
				{
					$project: {
						product_name: "$product.name",
						new_price: 1,
						cupon_code: 1,
						store_name: "$store.name",
						store_address: "$store.address"
					}
				}
			],
			(error, docs) => {
				if (error) {
					res.status(400).json({ message: `Retrieving data failed. Reason: ${err.errmsg}` });
				}
				res.json(docs);
			}
		);
	});
};
