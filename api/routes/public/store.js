module.exports = (router, db, mongojs) => {
	/**
	 * @swagger
	 * /stores:
	 *   get:
	 *     tags:
	 *       - stores
	 *     name: stores
	 *     summary: Get all stores in system
	 *     parameters:
	 *       - name: offset
	 *         in: query
	 *         description: The offset of the store list.
	 *         type: integer
	 *         default: 0
	 *       - name: limit
	 *         in: query
	 *         description: The limit of the store list.
	 *         type: integer
	 *         default: 5
	 *     produces:
	 *       - application/json
	 *     responses:
	 *       200:
	 *         description: Returned a list of all stores in system
	 *       400:
	 *         description: Invalid user request.
	 *       401:
	 *         description: Unauthorized access.
	 *       500:
	 *         description: Something is wrong with the service. Please contact the system administrator.
	 */

	router.get("/stores", (req, res) => {
		let limit = Number(req.query.limit) || 5;
		let skip = Number(req.query.skip) || 0;
		db.stores
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
	 * /stores/products:
	 *   get:
	 *     tags:
	 *       - stores
	 *     name: stores
	 *     summary: Get all products in stores in system
	 *     parameters:
	 *       - name: offset
	 *         in: query
	 *         description: The offset of the store list.
	 *         type: integer
	 *         default: 0
	 *       - name: limit
	 *         in: query
	 *         description: The limit of the store list.
	 *         type: integer
	 *         default: 5
	 *     produces:
	 *       - application/json
	 *     responses:
	 *       200:
	 *         description: Returned a list of all products in stores in system
	 *       400:
	 *         description: Invalid user request.
	 *       401:
	 *         description: Unauthorized access.
	 *       500:
	 *         description: Something is wrong with the service. Please contact the system administrator.
	 */

	router.get("/stores/products", (req, res) => {
		let limit = Number(req.query.limit) || 5;
		let skip = Number(req.query.skip) || 0;
		db.store_products.aggregate(
			[
				{ $sort: { price: 1 } },
				{ $skip: skip },
				{ $limit: limit },
				{ $lookup: { from: "stores", localField: "store_id", foreignField: "_id", as: "store" } },
				{ $lookup: { from: "products", localField: "product_id", foreignField: "_id", as: "product" } },
				{ $unwind: "$store" },
				{ $unwind: "$product" },
				{
					$project: {
						product_name: "$product.name",
						product_id: "$product._id",
						price: 1,
						store_name: "$store.name",
						store_id: "$store._id",
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
	 * /stores/{store_id}:
	 *   get:
	 *     tags:
	 *       - stores
	 *     name: getStoreById
	 *     summary: Get a store from the system by its ID
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *       - name: store_id
	 *         in: path
	 *         description: ID of the store
	 *         required: true
	 *         type: string
	 *         default: '5def7ea44108275e78558d65'
	 *     responses:
	 *       200:
	 *         description: Returned a single store from the system
	 *       400:
	 *         description: Invalid user request.
	 *       401:
	 *         description: Unauthorized access.
	 *       500:
	 *         description: Something is wrong with the service. Please contact the system administrator.
	 */

	router.get("/stores/:id", (req, res) => {
		let id = req.params.id;
		db.stores.findOne({ _id: mongojs.ObjectId(id) }, (error, docs) => {
			if (error) {
				res.status(400).json({ message: `Retrieving data failed. Reason: ${error.errmsg}` });
			}
			res.json(docs);
		});
	});

	/**
	 * @swagger
	 * /stores/city/{city}:
	 *   get:
	 *     tags:
	 *       - stores
	 *     name: getStoreByCity
	 *     summary: Get a store from the system by its city
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *       - name: city
	 *         in: path
	 *         description: City of the store
	 *         required: true
	 *         type: string
	 *         default: 'sarajevo'
	 *     responses:
	 *       200:
	 *         description: List a single store from the system based on the city
	 *       400:
	 *         description: Invalid user request.
	 *       401:
	 *         description: Unauthorized access.
	 *       500:
	 *         description: Something is wrong with the service. Please contact the system administrator.
	 */

	router.get("/stores/city/:city", (req, res) => {
		let city = req.params.city;
		db.stores.find({ city: { $regex: city, $options: "i" } }).sort({ name: 1 }, (error, docs) => {
			if (error) {
				res.status(400).json({ message: `Retrieving data failed. Reason: ${error.errmsg}` });
			}
			res.json(docs);
		});
	});


};
