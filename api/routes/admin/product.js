module.exports = (router, db, mongojs) => {
	/**
	 * @swagger
	 * /admin/products/count:
	 *   get:
	 *     tags:
	 *       - products
	 *     name: getProductCount
	 *     summary: Get count of products in system
	 *     security:
	 *       - bearerAuth: []
	 *     produces:
	 *       - application/json
	 *     responses:
	 *       200:
	 *           description: Returned count of products in system
	 *       400:
	 *           description: Invalid user request.
	 *       401:
	 *           description: Unauthorized access.
	 *       500:
	 *           description: Something is wrong with service please contact system administrator
	 */

	router.get('/products/count', (req, res) => {
		db.store_products.aggregate([
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
	 * /admin/products/names:
	 *   get:
	 *     tags:
	 *       - products
	 *     name: getProductNames
	 *     summary: Get the name and id of products in system
	 *     security:
	 *       - bearerAuth: []
	 *     produces:
	 *       - application/json
	 *     responses:
	 *       200:
	 *           description: Returned the name and id of products in system
	 *       400:
	 *           description: Invalid user request.
	 *       401:
	 *           description: Unauthorized access.
	 *       500:
	 *           description: Something is wrong with service please contact system administrator
	 */

	router.get('/products/names', (req, res) => {
		db.products.find({}, { name: 1 }, (error, docs) => {
			if (error) {
				res.status(400).json({ message: `Retrieving data failed. Reason: ${error.errmsg}` });
			}
			res.json(docs);
		})
	});

	/**
	 * @swagger
	 * /admin/products/count/completed:
	 *   get:
	 *     tags:
	 *       - products
	 *     name: getOrderProductsCount
	 *     summary: Get count of orderd products in system
	 *     security:
	 *       - bearerAuth: []
	 *     produces:
	 *       - application/json
	 *     responses:
	 *       200:
	 *           description: Returned count of orderd products in system
	 *       400:
	 *           description: Invalid user request.
	 *       401:
	 *           description: Unauthorized access.
	 *       500:
	 *           description: Something is wrong with service please contact system administrator
	 */

	router.get('/products/count/completed', (req, res) => {
		db.shopping_carts.aggregate([
			{ $match: { status: 1.0 } },
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
	 * /admin/products:
	 *   post:
	 *     tags:
	 *       - products
	 *     name: addProducts
	 *     summary: Add a new store to the system
	 *     security:
	 *       - bearerAuth: []
	 *     consumes:
	 *       - application/json
	 *     parameters:
	 *       - in: body
	 *         name: body
	 *         description: Product object
	 *         required: true
	 *         schema:
	 *             $ref: "#/definitions/Product"
	 *     responses:
	 *       200:
	 *         description: Resturned new product
	 *       400:
	 *           description: Invalid user request.
	 *       401:
	 *           description: Unauthorized access.
	 *       500:
	 *         description: Something is wrong with service please contact system administrator
	 */

	router.post("/products", (req, res) => {
		req.body.date_added = mongojs.Timestamp(req.body.date_added);
		db.products.insert(req.body, (error, docs) => {
			if (error) {
				res.status(400).json({ message: `Insert failed. Reason: ${error.errmsg}` });
			}
			res.json(docs);
		});
	});



	/**
	 * @swagger
	 * /admin/products/{id}:
	 *   put:
	 *     tags:
	 *       - products
	 *     name: updateProducts
	 *     summary: Update product details.
	 *     security:
	 *       - bearerAuth: []
	 *     consumes:
	 *       - application/json
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         description: ID of the product
	 *         required: true
	 *         type: string
	 *         default: '5de4262df71e2c88b4835871'
	 *       - in: body
	 *         name: body
	 *         description: Product object
	 *         required: true
	 *         schema:
	 *             $ref: "#/definitions/Product"
	 *     responses:
	 *       200:
	 *         description: Returned updated product
	 *       400:
	 *           description: Invalid user request.
	 *       401:
	 *           description: Unauthorized access.
	 *       500:
	 *         description: Something is wrong with service please contact system administrator
	 */

	router.put("/products/:id", (req, res) => {
		req.body.date_added = mongojs.Timestamp(req.body.date_added);
		let id = req.params.id;
		let itemUpdate = req.body;
		db.products.findAndModify(
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
	 * /admin/products/{id}:
	 *   delete:
	 *     tags:
	 *       - products
	 *     name: deleteProductById
	 *     summary: Delete a product from the system by its ID
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
	 *         default: '5de4262df71e2c88b4835871'
	 *     responses:
	 *       200:
	 *         description: Successfully deletes a single product from the system
	 *       400:
	 *           description: Invalid user request.
	 *       401:
	 *           description: Unauthorized access.
	 *       500:
	 *         description: Something is wrong with the service. Please contact the system administrator.
	 */

	router.delete("/products/:id", (req, res) => {
		let id = req.params.id;
		db.products.remove({ _id: mongojs.ObjectId(id) }, [true], (error, docs) => {
			if (error) {
				res.status(400).json({ message: `Delete failed. Reason: ${error.errmsg}` });
			}
			res.json(docs);
		});
	});
};
