module.exports = (router, db, mongojs) =>{

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
    *     security:
    *       - bearerAuth: []
    *     produces:
    *       - application/json
    *     responses:
    *       200:
    *         description: List of all stores in system
    *       500:
    *         description: Something is wrong with service please contact system administrator
    */

    router.get('/stores', (req, res) => {
        let limit = Number(req.query.limit) || 5;
        let skip = Number(req.query.skip) || 0;
        db.stores.find({}).skip(skip).limit(limit, (error, docs) =>{
            if(error){
                throw error;
            }
            res.json(docs);
        });
    });

    /**
    * @swagger
    * /stores/{store_id}:
    *   get:
    *     tags:
    *       - stores
    *     name: getStoreById
    *     summary: Get a store from the system by its ID
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
    *         description: List a single store from the system
    *       400:
    *           description: Invalid user request.
    *       401:
    *           description: Unauthorized access.
    *       500:
    *         description: Something is wrong with the service. Please contact the system administrator.
    */
    
    router.get('/stores/:id', (req, res) => {
        let id = req.params.id;
        db.stores.findOne({_id: mongojs.ObjectId(id)}, (error, docs) => {
            if(error){
                throw error;
            }
            res.json(docs);
        });
    });
    
    router.get('/stores/:city', (req, res) => {
        let city = req.params.city;
        db.stores.find({city: {$regex: city, $options:'i'}}).sort({name:1}, (error, docs) =>{
            if(error){
                throw error;
            }
            res.json(docs);
        });    
    });
}