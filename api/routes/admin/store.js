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
                throw error;
            }
            res.json(docs);
        });
    });
    
    router.delete('/stores/:id', (req, res) => {
        let id = req.params.id;
        db.products.remove({_id: mongojs.ObjectId(id)}, [true], (error, docs)=>{
            if(error){
                throw error;
            }
            res.json(docs);
        });
    });
}