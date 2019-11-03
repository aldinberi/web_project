const express = require('express');
const app = express();
const port =  process.env.PORT || 3000;

const mongojs = require('mongojs');

const db = mongojs('mongodb+srv://beri:aldin@cluster0-lsyrc.mongodb.net/granApp?retryWrites=true&w=majority');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/products', (req, res) => {
    db.products.find({}, (error, docs) => {
        if(error){
            throw error;
        }
        res.json(docs);
    });
});

app.get('/category/:name/products', (req, res) => {
    let category = req.params.name;
    db.products.find({category: {$regex: category, $options:'i'}}).sort({name:1}, (error, docs) =>{
        if(error){
            throw error;
        }
        res.json(docs);
    });    
});

app.get('/produts', (req, res) => {
    let limit = Number(req.query.limit) || 5;
    let skip = Number(req.query.skip) || 0;
    db.products.find({}).skip(skip).limit(limit, (error, docs) =>{
        if(error){
            throw error;
        }
        res.json(docs);
    });
});

app.post('/products', (req, res) => {
    db.products.insert(req.body, (error, docs) =>{
        if(error){
            throw error;
        }
        res.json(docs);
    });
});

app.put('/products/:id', (req, res) => {
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

app.delete('/productss/:id', (req, res) => {
    let id = req.params.id;
    db.products.remove({_id: mongojs.ObjectId(id)}, [true], (error, docs)=>{
        if(error){
            throw error;
        }
        res.json(docs);
    });
});

app.get('/products/:id/cheapest', (req, res)=> {
    let id = req.params.id;
    db.store_products.aggregate([
        {$match: {product_id: mongojs.ObjectId(id)}},
        {$sort:{price: 1}},
        {$limit: 1},
        {$lookup: {from: 'stores', localField: 'store_id', foreignField: '_id', as:'store'}},
        {$lookup: {from: 'products', localField: 'product_id', foreignField:'_id', as: 'product'}},
        {$unwind:'$store'},
        {$unwind: '$produt'},
        {$project: {product_name: 'product.name', price: 1, store_name:'store.name', store_address:'$store.address'}}
    ], (error, docs) => {
        if(error){
            throw error;
        }
        res.json(docs);

    });
});

app.listen(port, () => {
    console.log('Server listening on port :' + port);
});


