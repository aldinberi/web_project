module.exports = (router, db, mongojs, jwt, config) =>{

    router.use((req, res, next) => {
        console.log(`Admin route accessed by: ${req.ip}` ); 

        let authorization = req.get('Authorization');
        if (authorization) {
            jwt.verify(authorization, process.env.JWT_SECRET || config.JWT_SECRET, (error, decoded) => {
                if (error) {
                    res.status(401).send({ message: 'Unauthorized access: ' + error.message });
                } else {
                    let userType = decoded.type;
                    if (userType === 'admin') {
                        next();
                    } else {
                        res.status(401).send({ message: 'Unauthorized access: improper privileges'});
                    }
                }
            });
        } else {
            res.status(401).send({ message: 'Unauthorized access.' });
        }
    });


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