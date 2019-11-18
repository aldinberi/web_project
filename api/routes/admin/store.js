module.exports = (router, db, mongojs) =>{

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
    *         description: Return a new store.
    *       400:
    *           description: Invalid user request.
    *       500:
    *         description: Something is wrong with the service. Please contact the system administrator.
    */

    router.post('/stores', (req, res) => {
        db.stores.insert(req.body, (error, docs) =>{
            if(error){
                res.status(400).json({ message: `Insert failed. Reason: ${err.errmsg}` });
            }
            res.json(docs);
        });
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
    *         default: '5db704ef3864c7524cd291ff'
    *       - in: body
    *         name: body
    *         description: Store object
    *         required: true
    *         schema:
    *             $ref: "#/definitions/Store"
    *     responses:
    *       200:
    *         description: Return the updated store.
    *       500:
    *         description: Something is wrong with the service. Please contact the system administrator.
    */

    router.put('/stores/:id', (req, res) => {
        var id = req.params.id;
        var object = req.body

        db.stores.findAndModify({
                query: { _id: mongojs.ObjectId(id) },
                update: { $set: object },
                new: true
                },(err, doc) => {
                if (err) {
                    res.status(400).json({ message: `Update failed. Reason: ${err.errmsg}` });
                }
                res.json(doc);
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
    *         default: '5db704ef3864c7524cd291ff'
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
    
    router.delete('/stores/:id', (req, res) => {
        let id = req.params.id;
        db.products.remove({_id: mongojs.ObjectId(id)}, [true], (error, docs)=>{
            if(error){
                res.status(400).json({ message: `Delete failed. Reason: ${err.errmsg}` });
            }
            res.json(docs);
        });
    });
}