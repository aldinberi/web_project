module.exports = (router, db, mongojs) =>{

    
    router.post('/products', (req, res) => {
        db.products.insert(req.body, (error, docs) =>{
            if(error){
                throw error;
            }
            res.json(docs);
        });
    });

    router.put('/products/:id', (req, res) => {
        let id = req.params.id;
        let itemUpdate = req.body;
        db.products.findAndModify({
            query : {_id:mongojs.ObjectId(id)}, update: {$set: itemUpdate}, new: true}, 
            (error, docs) => {
                if(error){
                    throw error;
                }
                res.json(docs);
        }); 
    });

    router.delete('/products/:id', (req, res) => {
        let id = req.params.id;
        db.products.remove({_id: mongojs.ObjectId(id)}, [true], (error, docs)=>{
            if(error){
                throw error;
            }
            res.json(docs);
        });
    });
}