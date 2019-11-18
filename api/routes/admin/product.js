module.exports = (router, db, mongojs) =>{

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
    *             $ref: "#/definitions/Products"
    *     responses:
    *       200:
    *         description: Return a new product.
    *       400:
    *           description: Invalid user request.
    *       500:
    *         description: Something is wrong with the service. Please contact the system administrator.
    */

    router.post('/products', (req, res) => {
        db.products.insert(req.body, (error, docs) =>{
            if(error){
                res.status(400).json({ message: `Insert failed. Reason: ${err.errmsg}` });
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
    *         default: '5db704ef3864c7524cd291ff'
    *       - in: body
    *         name: body
    *         description: Product object
    *         required: true
    *         schema:
    *             $ref: "#/definitions/Product"
    *     responses:
    *       200:
    *         description: Return the updated product.
    *       500:
    *         description: Something is wrong with the service. Please contact the system administrator.
    */

    router.put('/products/:id', (req, res) => {
        let id = req.params.id;
        let itemUpdate = req.body;
        db.products.findAndModify({
            query : {_id:mongojs.ObjectId(id)}, update: {$set: itemUpdate}, new: true}, 
            (error, docs) => {
                if(error){
                    res.status(400).json({ message: `Update failed. Reason: ${err.errmsg}` });
                }
                res.json(docs);
        }); 
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
    *         default: '5db704ef3864c7524cd291ff'
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

    router.delete('/products/:id', (req, res) => {
        let id = req.params.id;
        db.products.remove({_id: mongojs.ObjectId(id)}, [true], (error, docs)=>{
            if(error){
                res.status(400).json({ message: `Delete failed. Reason: ${err.errmsg}` });
            }
            res.json(docs);
        });
    });
}