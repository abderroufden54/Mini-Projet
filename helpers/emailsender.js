let nodemailer=require('nodemailer');
const transport=nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: "abderraoufdenden2022@gmail.com",
      pass: "rkzanptbjpivvntp",
    },
  });
  module.exports.sendconfirmationemail=(email,activationcode)=>{
   transport.sendMail({
        from: 'abderraoufdenden2022@gmail.com',
        to: email,
        subject: 'Activation de votre comptre',
        html: "<html><body>Please activate your account<h1>Click the link below</h1><a href='http://127.0.0.1:3000/confirm-compte/"+activationcode+"'>click here link</a></body></html>"
    }, (err, info) => {
        if(err){
       console.log(err);
        }
        

    });


  }