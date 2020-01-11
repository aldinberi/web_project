module.exports = (router, db, mongojs) => {
	/**
	 * @swagger
	 * /admin/cupons:
	 *   post:
	 *     tags:
	 *       - cupons
	 *     name: addCupons
	 *     summary: Add a new cupon to the system
	 *     security:
	 *       - bearerAuth: []
	 *     consumes:
	 *       - application/json
	 *     parameters:
	 *       - in: body
	 *         name: body
	 *         description: Cupon object
	 *         required: true
	 *         schema:
	 *             $ref: "#/definitions/Cupon"
	 *     responses:
	 *       200:
	 *         description: Returned a new cupon.
	 *       400:
	 *           description: Invalid user request.
	 *       401:
	 *           description: Unauthorized access.
	 *       500:
	 *         description: Something is wrong with service please contact system administrator
	 */

	router.post("/cupons", (req, res) => {
		req.body.store_product_id = mongojs.ObjectId(req.body.store_product_id);
		db.cupons.insert(req.body, (error, docs) => {
			if (error) {
				res.status(400).json({ message: `Insert failed. Reason: ${error.errmsg}` });
			}
			res.json(docs);
		});
	});

	/**
	 * @swagger
	 * /admin/cupons/{id}:
	 *   put:
	 *     tags:
	 *       - cupons
	 *     name: updateCupons
	 *     summary: Update cupon details.
	 *     security:
	 *       - bearerAuth: []
	 *     consumes:
	 *       - application/json
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         description: ID of the cupon
	 *         required: true
	 *         type: string
	 *         default: '5e1a2db302238a4cbc3dbb78'
	 *       - in: body
	 *         name: body
	 *         description: Cupon object
	 *         required: true
	 *         schema:
	 *             $ref: "#/definitions/Cupon"
	 *     responses:
	 *       200:
	 *         description: Returned updated cupon
	 *       400:
	 *           description: Invalid user request.
	 *       401:
	 *           description: Unauthorized access.
	 *       500:
	 *         description: Something is wrong with service please contact system administrator
	 */

	router.put("/cupons/:id", (req, res) => {
		let id = req.params.id;
		req.body.store_product_id = mongojs.ObjectId(req.body.store_product_id);
		let itemUpdate = req.body;
		db.cupons.findAndModify(
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
	 * /admin/cupons/{id}:
	 *   delete:
	 *     tags:
	 *       - cupons
	 *     name: deleteCuponById
	 *     summary: Delete a cupon from the system by its ID
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
	 *         default: '5e1a2db302238a4cbc3dbb78'
	 *     responses:
	 *       200:
	 *         description: Successfully deleted a single cupon from the system
	 *       400:
	 *           description: Invalid user request.
	 *       401:
	 *           description: Unauthorized access.
	 *       500:
	 *         description: Something is wrong with the service. Please contact the system administrator.
	 */

	router.delete("/cupons/:id", (req, res) => {
		let id = req.params.id;
		db.cupons.remove({ _id: mongojs.ObjectId(id) }, [true], (error, docs) => {
			if (error) {
				res.status(400).json({ message: `Delete failed. Reason: ${error.errmsg}` });
			}
			res.json(docs);
		});
	});
};
