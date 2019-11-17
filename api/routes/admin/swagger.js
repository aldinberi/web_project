module.exports = (router, config, swaggerJSDoc, swaggerUi) =>{
    const swaggerDefinition = {
        info:{
            title: 'GranApp Swagger API Documentation',
            version: '1.0.0'
        },
        host: process.env.SWAGGER_HOST || config.SWAGGER_HOST,
        basePath:'/',
        securityDefinitions: {
            bearerAuth:{
                type:'apiKey',
                name:'Authorization',
                scheme:'bearer',
                in:'header'
            }
        }
    };
    
    const options = {
        swaggerDefinition,
        apis: [

            './*.js',
            './../public/*.js',
        ]
    };

    const swaggerSpec = swaggerJSDoc(options);

    router.get('/swagger.json', (req, res)=>{
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
    
    router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

}