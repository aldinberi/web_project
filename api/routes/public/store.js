module.exports = (router, db, mongojs) =>{

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