module.exports = (router, db, mongojs) => {

	/**
	 * @swagger
	 * /admin/stores/count:
	 *   get:
	 *     tags:
	 *       - stores
	 *     name: getStoreCount
	 *     summary: Get count of stores in system
	 *     security:
	 *       - bearerAuth: []
	 *     produces:
	 *       - application/json
	 *     responses:
	 *       200:
	 *           description: Returned count of stores in system
	 *       400:
	 *           description: Invalid user request.
	 *       401:
	 *           description: Unauthorized access.
	 *       500:
	 *           description: Something is wrong with service please contact system administrator
	 */

	router.get('/stores/count', (req, res) => {
		db.stores.aggregate([
			{ $group: { _id: null, count: { $sum: 1 } } },
			{ $project: { _id: 0, count: 1 } }
		], (error, docs) => {
			if (error) {
				res.status(400).json({ message: `Retrieving data failed. Reason: ${error.errmsg}` });
			}
			res.json(docs);
		})
	});

	/**
 * @swagger
 * /admin/stores/names:
 *   get:
 *     tags:
 *       - stores
 *     name: getStoreNames
 *     summary: Get the name and id of stores in system
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *           description: Returned the name and id of stores in system
 *       400:
 *           description: Invalid user request.
 *       401:
 *           description: Unauthorized access.
 *       500:
 *           description: Something is wrong with service please contact system administrator
 */

	router.get('/stores/names', (req, res) => {
		db.stores.find({}, { name: 1 }, (error, docs) => {
			if (error) {
				res.status(400).json({ message: `Retrieving data failed. Reason: ${error.errmsg}` });
			}
			res.json(docs);
		})
	});

	/**
	 * @swagger
	 * /admin/stores/numberOfProducts:
	 *   get:
	 *     tags:
	 *       - stores
	 *     name: getStoreProductNumber
	 *     summary: Get number of products in stores 
	 *     security:
	 *       - bearerAuth: []
	 *     produces:
	 *       - application/json
	 *     responses:
	 *       200:
	 *           description: Returned number of products in stores  in system
	 *       400:
	 *           description: Invalid user request.
	 *       401:
	 *           description: Unauthorized access.
	 *       500:
	 *           description: Something is wrong with service please contact system administrator
	 */

	router.get('/stores/numberOfProducts', (req, res) => {
		db.store_products.aggregate([
			{ $group: { _id: "$store_id", count: { $sum: 1 } } },
			{ $lookup: { from: "stores", localField: "_id", foreignField: "_id", as: "store" } },
			{ $unwind: "$store" },
			{ $project: { _id: 0, name: "$store.name", count: 1 } }
		], (error, docs) => {
			if (error) {
				res.status(400).json({ message: `Retrieving data failed. Reason: ${error.errmsg}` });
			}
			res.json(docs);
		})
	});

	/**
	 * @swagger
	 * /admin/stores:
	 *   post:
	 *     tags:
	 *       - stores
	 *     name: addStores
	 *     summary: Add a new store to the system
	 *     security:
	 *       - bearerAuth: []
	 *     consumes:
	 *       - application/json
	 *     parameters:
	 *       - in: body
	 *         name: body
	 *         description: Store object
	 *         required: true
	 *         schema:
	 *             $ref: "#/definitions/Store"
	 *     responses:
	 *       200:
	 *         description: Returned a new store.
	 *       400:
	 *           description: Invalid user request.
	 *       401:
	 *           description: Unauthorized access.
	 *       500:
	 *         description: Something is wrong with the service. Please contact the system administrator.
	 */

	router.post("/stores", (req, res) => {
		db.stores.insert(req.body, (error, docs) => {
			if (error) {
				res.status(400).json({ message: `Insert failed. Reason: ${error.errmsg}` });
			}
			res.json(docs);
		});
	});

	/**
	 * @swagger
	 * /admin/stores/product:
	 *   post:
	 *     tags:
	 *       - stores
	 *     name: addStoreProduct
	 *     summary: Add a new store to the system
	 *     security:
	 *       - bearerAuth: []
	 *     consumes:
	 *       - application/json
	 *     parameters:
	 *       - in: body
	 *         name: body
	 *         description: Store object
	 *         required: true
	 *         schema:
	 *             $ref: "#/definitions/StoreProduct"
	 *     responses:
	 *       200:
	 *         description: Returned a new store.
	 *       400:
	 *           description: Invalid user request.
	 *       401:
	 *           description: Unauthorized access.
	 *       500:
	 *         description: Something is wrong with the service. Please contact the system administrator.
	 */

	router.post("/stores/product", (req, res) => {
		db.store_products.insert(
			{
				store_id: mongojs.ObjectId(req.body.store_id),
				product_id: mongojs.ObjectId(req.body.product_id),
				price: req.body.price
			},
			(error, docs) => {
				if (error) {
					res.status(400).json({ message: `Insert failed. Reason: ${error.errmsg}` });
				}
				res.json(docs);
			}
		);
	});

	/**
 * @swagger
 * /admin/stores/product/{id}:
 *   put:
 *     tags:
 *       - stores
 *     name: addStoreProduct
 *     summary: Add a new store to the system
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the store product
 *         required: true
 *         type: string
 *         default: '5def93246ca8a44394d6fc88'
 *       - name: body
 *         in: body
 *         description: Store object
 *         required: true
 *         schema:
 *             $ref: "#/definitions/StoreProduct"
 *     responses:
 *       200:
 *         description: Returned a new store.
 *       400:
 *           description: Invalid user request.
 *       401:
 *           description: Unauthorized access.
 *       500:
 *         description: Something is wrong with the service. Please contact the system administrator.
 */

	router.put("/stores/product/:id", (req, res) => {
		var id = req.params.id;
		var object = req.body;
		db.store_products.findAndModify(
			{
				query: { _id: mongojs.ObjectId(id) },
				update: { $set: { product_id: mongojs.ObjectId(object.product_id), store_id: mongojs.ObjectId(object.store_id), price: object.price } },
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
	 * /admin/stores/{store_id}:
	 *   put:
	 *     tags:
	 *       - stores
	 *     name: updateStore
	 *     summary: Update store details.
	 *     security:
	 *       - bearerAuth: []
	 *     consumes:
	 *       - application/json
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *       - in: path
	 *         name: store_id
	 *         description: ID of the store
	 *         required: true
	 *         type: string
	 *         default: '5def7ea44108275e78558d65'
	 *       - in: body
	 *         name: body
	 *         description: Store object
	 *         required: true
	 *         schema:
	 *             $ref: "#/definitions/Store"
	 *     responses:
	 *       200:
	 *         description: Returned the updated store.
	 *       400:
	 *           description: Invalid user request.
	 *       401:
	 *           description: Unauthorized access.
	 *       500:
	 *         description: Something is wrong with the service. Please contact the system administrator.
	 */

	router.put("/stores/:id", (req, res) => {
		var id = req.params.id;
		var object = req.body;
		db.stores.findAndModify(
			{
				query: { _id: mongojs.ObjectId(id) },
				update: { $set: object },
				new: true
			},
			(error, doc) => {
				if (error) {
					res.status(400).json({ message: `Update failed. Reason: ${error.errmsg}` });
				}
				res.json(doc);
			}
		);
	});

	/**
 * @swagger
 * /admin/stores/product/{id}:
 *   delete:
 *     tags:
 *       - stores
 *     name: deleteStoreById
 *     summary: Delete a store from the system by its ID
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the store product
 *         required: true
 *         type: string
 *         default: '5e19e93a67f6696124f8edff'
 *     responses:
 *       200:
 *         description: Successfully deletes a single store product from the system
 *       400:
 *           description: Invalid user request.
 *       401:
 *           description: Unauthorized access.
 *       500:
 *         description: Something is wrong with the service. Please contact the system administrator.
 */

	router.delete("/stores/product/:id", (req, res) => {
		let id = req.params.id;
		db.store_products.remove({ _id: mongojs.ObjectId(id) }, [true], (error, docs) => {
			if (error) {
				res.status(400).json({ message: `Delete failed. Reason: ${error.errmsg}` });
			}
			res.json(docs);
		});
	});

	/**
	 * @swagger
	 * /admin/stores/{store_id}:
	 *   delete:
	 *     tags:
	 *       - stores
	 *     name: deleteStoreById
	 *     summary: Delete a store from the system by its ID
	 *     security:
	 *       - bearerAuth: []
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
	 *         description: Successfully deletes a single store from the system
	 *       400:
	 *           description: Invalid user request.
	 *       401:
	 *           description: Unauthorized access.
	 *       500:
	 *         description: Something is wrong with the service. Please contact the system administrator.
	 */

	router.delete("/stores/:id", (req, res) => {
		let id = req.params.id;
		db.stores.remove({ _id: mongojs.ObjectId(id) }, [true], (error, docs) => {
			if (error) {
				res.status(400).json({ message: `Delete failed. Reason: ${error.errmsg}` });
			}
			res.json(docs);
		});
	});
};
