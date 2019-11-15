module.exports = (router, db, mongojs) =>{

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