const passport_local=require('passport-local').Strategy;
module.exports=passportConfig=function(passport){
    function initialize(passport){
        const authenticateUser=(email,password,done)=>{
         const user=getuserbyemail(email);
         if(user==null){
             return done(null,false);
         }
         if(user.password==password){
             return done(null,user)
         }
         else{
             return(done,true);
         }
         }
        }
    }