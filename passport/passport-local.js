
const passport_local=require('passport-local').Strategy;
const User=require('../schemas/UserSchema');
const multer=require('multer');
const upload=multer({});
var crypto = require('crypto');
const emailsending=require('../helpers/emailsender');
module.exports=passportConfig=function(passport){
passport.serializeUser((user,done)=>{
    console.log('gg');
   done(null,{ id: user.id, username: user.username,role:user.Role });
   console.log(user.role);
   
});
passport.deserializeUser((user,done)=>{
   User.findById(user.id,(err,user)=>{
    done(err,user);
   });
 });
 passport.use('locale',new passport_local({usernameField:'email',passwordField:'password',passReqToCallback:true},(req,email,pass,done)=>{
    console.log('be');
    User.findOne({$or: [{email:req.body.email}, {username: req.body.username}]},(err,user)=>{
        if(err){
            return done(err,false,req.flash('error',"S'il vaut plait essayer encore"));
        }
        if(user){
            return done(null,false,req.flash('error','Utilisteur déja existe'));
        }
        let usera={'firstName':req.body.nom,'lastName':req.body.prenom,'email':req.body.email,'username':req.body.username,'role':'user'}
        usera.statut=req.body.statut;
        usera.facebook_url=req.body.facebook_url;
        usera.twitter_url=req.body.twitter_url;
        usera.instagram_url=req.body.instagram_url;
        usera.linkedin_url=req.body.instagram_url;
        usera.Role='simple';
        usera.address=req.body.address;
        usera.birthday=req.body.birthday;
        usera.mobile=req.body.mobile;
        let a=genPassword(req.body.password);
        usera.salt=a.salt;
        usera.password=a.hash;
        if(req.files.length>0){
           console.log(req.files);
        if(req.files[0].fieldname=='profilePic'){
            console.log('ff');
            console.log(req.files[0].filename);
            usera.profilePic=req.files[0].filename;
        }
        if(req.files[0].fieldname==='coverPhoto'){
            usera.coverPhoto=req.files[0].filename;;
        }
        if(req.files[1] && req.files[1].fieldname==='coverPhoto'){
            usera.coverPhoto=req.files[1].filename;;
        }
    }
    usera.is_activated=false;
        /*usera.profilePic=file.buffer.profilePic;
        usera.coverPhoto=file.buffer.coverPhoto;*/
        const characters="0123456789azertyuiopmlkjhgfdsqwxcvbnAZERTYUIOPMLKJHGFDSSQWXCVBN";
           let charact="";
             for (let index = 0; index <15; index++) {
                charact+=characters[Math.floor(Math.random()*characters.length)];
                
             }
             usera.token=charact;
        const newuser=new User(usera);
        newuser.save((err)=>{
            
            if(err){
                return done(err,false,req.flash('error',"S'il vaut plait essayer encore"));
            }
            
             emailsending.sendconfirmationemail(req.body.email,charact);

            return done(null,newuser,req.flash('messao','fdfdf'));
        });
    });
 }));
 passport.use('signin',new passport_local({usernameField:'user',passwordField:'pass',passReqToCallback:true},async(req,email,pass,done)=>{
    console.log('hou');
   const user= await User.findOne({$or: [{email:req.body.user}, {username: req.body.user}]});
    console.log(user);
    if(user==null){
        console.log('hu');
        req.flash('error','no user');
        return done(null,false);
    }
    console.log(user.password);
    console.log(user.email);
    console.log(pass);
    if(validPassword(req.body.pass,user.password,user.salt))
    {
        console.log('hi');
        req.flash('url','affichclub');
        if(user.is_activated==true){
        return done(null,user);
        }
        else if(user.is_activated==false && user.token){
            req.flash('error',"Activer votre compte s'il vous plait");
            return done(null,false);
        }
        else{
            req.flash('error',"Votre compte est suspendu");
            return done(null,false);
        }

    }
    else{
        console.log('hiya');
        req.flash('error','invalid password');
        return done(null,false);
    }
    }));

    
 

 
}
function validPassword(password, hash, salt) {
        var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
        console.log(hashVerify);
        return hash === hashVerify;
    }
    function genPassword(password) {
        var salt = crypto.randomBytes(32).toString('hex');
        var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
        
        return {
          salt: salt,
          hash: genHash
        };
    }
    


