module.exports = (router, db, mongojs) => {

    /**
 * @swagger
 * /admin/users/count:
 *   get:
 *     tags:
 *       - users
 *     name: getUserCount
 *     summary: Get count of users in system
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *           description: Returned count of users in system
 *       400:
 *           description: Invalid user request.
 *       401:
 *           description: Unauthorized access.
 *       500:
 *           description: Something is wrong with service please contact system administrator
 */

    router.get('/users/count', (req, res) => {
        db.users.aggregate([
            { $group: { _id: null, count: { $sum: 1 } } },
            { $project: { _id: 0, count: 1 } }
        ], (error, docs) => {
            if (error) {
                res.status(400).json({ message: `Retrieving data failed. Reason: ${error.errmsg}` });
            }
            res.json(docs);
        })
    });


};
