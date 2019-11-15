module.exports = (router, db, mongojs, config, google) =>{
    
    const oauth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID || config.CLIENT_ID,
        process.env.CLIENT_SECRET || config.CLIENT_SECRET,
        process.env.REDIRECT_URL || config.REDIRECT_URL
    );
    
    router.get('/login', (req, res) => {
        let code = req.query.code;
        if (code) {
          oauth2Client.getToken(code).then((result) => {
              oauth2Client.setCredentials({access_token: result.tokens.access_token});
              let oauth2 = google.oauth2({
                  auth: oauth2Client,
                  version: 'v2'
              });
              
              oauth2.userinfo.get((err, response) => {
                  if (err) {
                      throw err;
                  }
                  let data = response.data;
    
                  db.users.findAndModify({ 
                      query: { email: data.email },
                      update: { $setOnInsert: { email: data.email, name: data.name, signup_time: new Date(), type: 'customer' } },
                      new: true,
                      upsert: true  
                  }, (error, doc) => {
                      if (error) {
                          console.log(error);
                      }
                      let jwtToken = jwt.sign({
                          ...data,
                          exp: (Math.floor(Date.now() / 1000) + 3600),
                          id: doc._id,
                          type: doc.type
                      }, process.env.JWT_SECRET || config.JWT_SECRET);
                      res.json({ 'jwt' : jwtToken });
                  });
              });
          });
        } else {
          const scopes = [
              'https://www.googleapis.com/auth/userinfo.profile',
              'https://www.googleapis.com/auth/userinfo.email'
          ];
          
          const url = oauth2Client.generateAuthUrl({
              access_type: 'online',
              scope: scopes
          });
          res.redirect(url);
        }
    });

}