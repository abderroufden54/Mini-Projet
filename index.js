const express=require('express');
const app=new express();
const {graphqlHTTP}=require('express-graphql');
const mongoose=require('mongoose');
const MongoStore = require("connect-mongo");
const cors = require("cors");
const passport=require('passport');
const schema=require('./data/schema');
const cookieParser=require('cookie-parser');
const route=express.Router();
const Publication=require('./schemas/PublicationSchema');
const cookieSession = require("cookie-session");
const multer=require('multer');
const User=require('./schemas/UserSchema');
const Club=require('./schemas/ClubSchema');
var bodyParser = require('body-parser');
var session = require('express-session');
const flash = require('connect-flash');
const Membership=require('./schemas/MembershipSchema');
const apiuser = require("./data/apiuser");
const apiclub = require("./data/apiclub");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  },
});
app.use(cors({
  origin:"http://localhost:3000",
  methods:['GET',"POST",'PUT','DELETE'],
  optionsSuccessStatus: 200, // For legacy browser support
  credentials: true, // This is important.
}))
app.use(express.static("uploads"));
const uploadStorage = multer({ storage: storage });
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(
  cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 * 300 * 1000 * 5000 })
);

app.use('/graphql',graphqlHTTP({
   schema:schema,
    graphiql:true,
})
)

app.use(session({
    secret: 'keyboard cat',
    cookie: { secure: true },
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/projetmicro'})
  }));
  mongoose.connect("mongodb://localhost:27017/projetmicro", { useNewUrlParser: true }, function (err, client) {
     if(err) throw err;
     console.log('connected');
  

     //Write databse Insert/Update/Query code here..
                
});
app.use(flash());
require('./passport/passport-local')(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true, // Enable GraphiQL interface for testing
}));
route.get('/failed',(req,res)=>{
  apiuser.GetReply({message:req.flash()['error']}, (err, data) => {
    if (!err) {
      console.log(data);
        res.status(400).send(data);
    }
    else{
        res.status(400).send(err);
    }
});

})
route.post('/api/signupe',(req,res)=>{
  res.send('Please Activate your account');
   
});
route.post('/pub/:id',uploadStorage.single('image'),async(req,res)=>{
  const publication=await Publication.create({article:req.body.article,image:req.file.filename,club_des:mongoose.Types.ObjectId(req.params.id),
  submit_by:mongoose.Types.ObjectId(req.user.id)
  });
  apiclub.Getpub({pub:publication}, (err, data) => {
    if (!err) {
      console.log('usera');
      console.log(data);
        return res.status(200).json(data.pub);
    }
    else{
      console.log(err);
        return res.status(400).send(err);
    }
})
})
route.put('/pub/:id',uploadStorage.single('image'),async(req,res)=>{
  let a={};
  if(req.file){
      a.image=req.file.filename;
  }
  if(req.body.article){
    a.article=req.body.article;
  }

  const publication=await Publication.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.id),a,{new:true});

  apiclub.Getpub({pub:publication}, (err, data) => {
    if (!err) {
      console.log('usera');
      console.log(data);
        return res.status(200).json(data.pub);
    }
    else{
      console.log(err);
        return res.status(400).send(err);
    }
})
});
route.delete('/pub/:id',uploadStorage.single('image'),async(req,res)=>{
  await Publication.findByIdAndDelete(mongoose.Types.ObjectId(req.params.id));
  apiclub.GetM({message:"deleted successfully"}, (err, data) => {
    if (!err) {
      console.log('usera');
      console.log(data);
        return res.status(200).json(data.message);
    }
    else{
      console.log(err);
        return res.status(400).send(err);
    }
})
});
route.get('/api/categories',(req,res)=>{
  const categories=Club.schema.path('category').enumValues;
  apiclub.GetCategories({categories:categories}, (err, data) => {
    if (!err) {
      console.log(data);
        res.status(200).json(data);
    }
    else{
        res.status(400).send(err);
    }
  });
   
});
route.post('/api/invit/:idclub',uploadStorage.single('image'),async(req,res)=>{
  let cluba=await Club.findById(mongoose.Types.ObjectId(req.params.idclub));
  let form_submite=[];
  let text_submite=[];
  let check_submite=[];
  req.body.form_submite.forEach((q,index) => {
    form_submite.push({'question':cluba.form_submite[index].question,'resp_don':cluba.form_submite[index].response,'is_other':cluba.form_submite[index].is_other,'resp_given':q.resp_given});
  });

});
route.get('/api/clubd/:id',async(req,res)=>{
  let cluba=await Club.findById(mongoose.Types.ObjectId(req.params.id));
  apiclub.getclubd({clubs:cluba}, (err, data) => {
    if (!err) {
      console.log(data);
        return res.status(200).json(data.clubs);
    }
    else{
      console.log(err);
        return res.status(400).send(err);
    }
  })

    
});
route.post('/api/addclub',uploadStorage.single('image'),async(req,res)=>{
  const data=JSON.parse(req.body.data);
  var newClub={
    name:data.name,
    description:data.description,
    slogan:data.slogan,
    category:data.category,
    facebook_url:data.facebook_url,
    twitter_url:data.twitter_url,
    instagram_url:data.instagram_url,
    linkedin_url:data.linkedin_url,
    form_submite:[],
    text_submite:[],
    check_submite:[],
    Image:req.file.filename,
    created_by:mongoose.Types.ObjectId(req.session.passport.user.id),
    admins:[mongoose.Types.ObjectId(req.session.passport.user.id)]
};
const questions=JSON.parse(req.body.questions);
questions.forEach(question => {
  if(question.type=="1"){
   newClub.form_submite.push(question);
  }
  else if(question.type=="2"){
    newClub.check_submite.push(question);
  }
  else{
    newClub.text_submite.push(question);

  }
  
});
newClub.logo=req.file.filename;
await Club.create(newClub).then(async(e)=>{
  await Membership.create({userId:mongoose.Types.ObjectId(req.session.passport.user.id),clubId:mongoose.Types.ObjectId(e._id)}).then((g)=>{
    apiclub.GetMessages({id:e._id.toString()}, (err, data) => {
      if (!err) {
        console.log('usera');
        console.log(data);
          return res.status(200).json(data.id);
      }
      else{
        console.log(err);
          return res.status(400).send(err);
      }
  })
})

})});
route.get('/api/club/:id',async(req,res)=>{
const club=await Club.findById(mongoose.Types.ObjectId(req.params.id)).populate({path:"publications",populate:[{path:"submit_by",model:User}]})
.populate({path:"members",populate:[{path:"userId",model:User}]}).populate({path:"admins",model:User});
console.log(club);
apiclub.GetClubsdetails({club:club}, (err, data) => {
  if (!err) {
    console.log(data);
      return res.status(200).json(data.club);
  }
  else{
    console.log(err);
      return res.status(400).send(err);
  }
})
});
app.get('/api/signout',(req,res)=>{
  req.logOut();
  res.send('ok');
}
);
route.post('/api/signup',uploadStorage.any(),passport.authenticate('locale',{
    session:false,
    failureRedirect:'/failed'
  }),(req,res)=>{
    apiuser.GetReply({message:'Please Activate your account'}, (err, data) => {
      if (!err) {
          res.send(data);
      }
      else{
          res.send(err);
      }
  });
     
  });
  app.get("/api/login/success",(req, res) => {

    if (req.isAuthenticated()) {
      const usera=req.user.toObject({ getters: true });
      apiuser.GetUser({user:usera}, (err, data) => {
        if (!err) {
          console.log('usera');
          console.log(data);
            res.status(200).json(data);
        }
        else{
          console.log(err);
            res.status(400).send(err);
        }
    });
    }
    else {
      apiuser.GetReply({message:'Not logged in'}, (err, data) => {
        if (!err) {
            res.status(400).send(data);
        }
        else{
            res.status(400).send(err);
        }
    });
    }
  });
  route.post('/api/login',passport.authenticate('signin',{
    session:true,
    failureFlash : true,
    failureRedirect:'/failed'})
    ,(req,res)=>{
       res.redirect('/api/login/success');
     
  });
  app.use('',route);
app.listen(5000,()=>{
    console.log('connected');
})