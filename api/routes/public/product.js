module.exports = (router, db, mongojs) => {
	/**
	 * @swagger
	 * /products:
	 *   get:
	 *     tags:
	 *       - products
	 *     name: products
	 *     summary: Get all products in system
	 *     parameters:
	 *       - name: offset
	 *         in: query
	 *         description: The offset of the product list.
	 *         type: integer
	 *         default: 0
	 *       - name: limit
	 *         in: query
	 *         description: The limit of the product list.
	 *         type: integer
	 *         default: 5
	 *     produces:
	 *       - application/json
	 *     responses:
	 *       200:
	 *           description: Returned a list of all products
	 *       400:
	 *           description: Invalid user request.
	 *       401:
	 *           description: Unauthorized access.
	 *       500:
	 *           description: Something is wrong with service please contact system administrator
	 */

	router.get("/products", (req, res) => {
		let limit = Number(req.query.limit) || 5;
		let skip = Number(req.query.skip) || 0;
		db.products
			.find({})
			.skip(skip)
			.limit(limit, (error, docs) => {
				if (error) {
					res.status(400).json({ message: `Retrieving data failed. Reason: ${error.errmsg}` });
				}
				res.json(docs);
			});
	});

	/**
	 * @swagger
	 * /products/{product_id}:
	 *   get:
	 *     tags:
	 *       - products
	 *     name: getProductById
	 *     summary: Get a product from the system by its ID
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *       - name: product_id
	 *         in: path
	 *         description: ID of the product
	 *         required: true
	 *         type: string
	 *         default: '5da4bd64eaea926c41e5e629'
	 *     responses:
	 *       200:
	 *         description: Returned a single product from the system
	 *       400:
	 *           description: Invalid user request.
	 *       401:
	 *           description: Unauthorized access.
	 *       500:
	 *         description: Something is wrong with the service. Please contact the system administrator.
	 */

	router.get("/products/:id", (req, res) => {
		let id = req.params.id;
		db.products.findOne({ _id: mongojs.ObjectId(id) }, (error, docs) => {
			if (error) {
				res.status(400).json({ message: `Retrieving data failed. Reason: ${error.errmsg}` });
			}
			res.json(docs);
		});
	});

	/**
	 * @swagger
	 * /category/{category}/products:
	 *   get:
	 *     tags:
	 *       - products
	 *     name: getProductsByCategory
	 *     summary: Get product list from the system by category
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *       - name: category
	 *         in: path
	 *         description: category of the products
	 *         required: true
	 *         type: string
	 *         default: 'SWEETS'
	 *     responses:
	 *       200:
	 *         description: Retured a list of products from the system by category
	 *       400:
	 *         description: Invalid user request.
	 *       401:
	 *         description: Unauthorized access.
	 *       500:
	 *         description: Something is wrong with the service. Please contact the system administrator.
	 */

	router.get("/category/:category/products", (req, res) => {
		let category = req.params.category;
		db.products.find({ category: { $regex: category, $options: "i" } }).sort({ name: 1 }, (error, docs) => {
			if (error) {
				res.status(400).json({ message: `Retrieving data failed. Reason: ${error.errmsg}` });
			}
			res.json(docs);
		});
	});

	/**
	 * @swagger
	 * /products/{id}/cheapest:
	 *   get:
	 *     tags:
	 *       - products
	 *     name: getProductByCheapestLocation
	 *     summary: Get cheapest product price from the system by its ID
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
	 *         description: Returned a list of cheapest price for product from the system
	 *       400:
	 *         description: Invalid user request.
	 *       401:
	 *         description: Unauthorized access.
	 *       500:
	 *         description: Something is wrong with the service. Please contact the system administrator.
	 */

	router.get("/products/:id/cheapest", (req, res) => {
		let id = req.params.id;
		db.store_products.aggregate(
			[
				{ $match: { product_id: mongojs.ObjectId(id) } },
				{ $sort: { price: 1 } },
				{ $limit: 1 },
				{ $lookup: { from: "stores", localField: "store_id", foreignField: "_id", as: "store" } },
				{ $lookup: { from: "products", localField: "product_id", foreignField: "_id", as: "product" } },
				{ $unwind: "$store" },
				{ $unwind: "$product" },
				{
					$project: {
						product_name: "$product.name",
						price: 1,
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
};
