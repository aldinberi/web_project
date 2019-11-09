module.exports = (router, db, mongojs) => {

    router.use((req, res, next) => {
        console.log(`New visit from ${req.ip} at ${new Date()}`);
        next();
    });

    router.get('/products', (req, res) => {
        db.products.find({}, (error, docs) => {
            if(error){
                throw error;
            }
            res.json(docs);
        });
    });
    
    router.get('/products/:id', (req, res) => {
        let id = req.params.id;
        db.products.findOne({_id: mongojs.ObjectId(id)}, (error, docs) => {
            if(error){
                throw error;
            }
            res.json(docs);
        });
    });
    
    
    router.get('/category/:name/products', (req, res) => {
        let category = req.params.name;
        db.products.find({category: {$regex: category, $options:'i'}}).sort({name:1}, (error, docs) =>{
            if(error){
                throw error;
            }
            res.json(docs);
        });    
    });
    
    router.get('/produts', (req, res) => {
        let limit = Number(req.query.limit) || 5;
        let skip = Number(req.query.skip) || 0;
        db.products.find({}).skip(skip).limit(limit, (error, docs) =>{
            if(error){
                throw error;
            }
            res.json(docs);
        });
    });
    
    
    
    
    router.get('/products/:id/cheapest', (req, res)=> {
        let id = req.params.id;
        db.store_products.aggregate([
            {$match: {product_id: mongojs.ObjectId(id)}},
            {$sort:{price: 1}},
            {$limit: 1},
            {$lookup: {from: 'stores', localField: 'store_id', foreignField: '_id', as:'store'}},
            {$lookup: {from: 'products', localField: 'product_id', foreignField:'_id', as: 'product'}},
            {$unwind:'$store'},
            {$unwind: '$product'},
            {$project: {product_name: '$product.name', price: 1, store_name:'$store.name', store_address:'$store.address'}}
        ], (error, docs) => {
            if(error){
                throw error;
            }
            res.json(docs);
    
        });
    });
    
    //stores crud
    router.get('/stores', (req, res) => {
        db.stores.find({}, (error, docs) => {
            if(error){
                throw error;
            }
            res.json(docs);
        });
    });
    
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