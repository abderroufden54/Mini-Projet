const passport_facebook=require('passport-facebook').Strategy;
const strat=require('../facebook/secret');
module.exports=passportf=function(passport){
passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });
passport.use(
    new passport_facebook(
  {
            clientID:'551555950058046',
            clientSecret:'6082557439bba3447fa983ac676eb365',
            profileFields: ["email", "name"],
            callbackURL:'http://localhost:3000/auth/facebook/callback',
            
       },
      function(accessToken, refreshToken, profile, done) {
        console.log(accessToken);
        console.log(profile.id);
        done(null, profile);
      }
    )
  );
    }
