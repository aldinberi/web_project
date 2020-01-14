module.exports = (router, db, mongojs) => {
	/**
	 * @swagger
	 * /customer/cupons/{store_product_id}:
	 *   get:
	 *     tags:
	 *       - cupons
	 *     name: checkCouponVadiliti
	 *     summary: Get users cart in system
	 *     parameters:
	 *       - in: path
	 *         name: store_product_id
	 *         description: ID of the store product
	 *         required: true
	 *         type: string
	 *         default: '5e19e38567f6696124f8edfb'
	 *     security:
	 *       - bearerAuth: []
	 *     produces:
	 *       - application/json
	 *     responses:
	 *       200:
	 *         description: Returend if the coupon code is valid
	 *       400:
	 *           description: Invalid user request.
	 *       401:
	 *           description: Unauthorized access.
	 *       500:
	 *         description: Something is wrong with service please contact system administrator
	 */

    router.get("/cupons/:store_product_id", (req, res) => {
        let store_product_id = req.params.store_product_id;

        db.cupons.aggregate([
            { $match: { store_product_id: mongojs.ObjectId(store_product_id) } },
            { $project: { coupon_code: 1, new_price: 1 } }

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
