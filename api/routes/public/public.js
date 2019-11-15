module.exports = (router, db, mongojs, express, config ,google) => {

    let product_router = express.Router();
    require('./product.js')(product_router, db, mongojs);
    router.use(product_router);

    let store_router = express.Router();
    require('./store.js')(store_router, db, mongojs);
    router.use(store_router);

    let login_router = express.Router();
    require('./login.js')(login_router, db, mongojs, config, google);
    router.use(login_router);

    router.use((req, res, next) => {
        console.log(`New visit from ${req.ip} at ${new Date()}`);
        next();
    });
}