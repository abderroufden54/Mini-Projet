const { authors, books } = require('../data/data');
const { GraphQLObjectType, GraphQLInputObjectType,GraphQLID, GraphQLString, GraphQLSchema, GraphQLList, graphql, GraphQLNonNull, GraphQLInt, GraphQLBoolean } = require('graphql');
const Club=require('../schemas/ClubSchema');
const User=require('../schemas/UserSchema');
const fs = require('fs');

const apiclub = require("./apiclub");

const storeUpload = async ({ stream, filename }) => {
    const uploadDir = "./uploads";
    const path = join(uploadDir, filename);
    return new Promise((resolve, reject) =>
      stream
        .pipe(createWriteStream(path))
        .on("finish", () => resolve({ path }))
        .on("error", reject)
    );
  };
  
  const processUpload = async (upload) => {
    const { createReadStream, filename, mimetype } = await upload;
    const stream = createReadStream();
    const { path } = await storeUpload({ stream, filename });
    return { filename, mimetype, path };
  };
  
const inputClubType=new GraphQLInputObjectType({
    name:"InputClub",
    fields: () => ({
        category:{ type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        slogan: { type: GraphQLString },
        image:{type: GraphQLString},
    questions:{type:new GraphQLList(inputQuestionType)},
        facebook_url: { type: GraphQLString },
        twitter_url: { type: GraphQLString },
        instagram_url: { type: GraphQLString },
        linkedin_url: { type: GraphQLString },
       
    })
});
const inputQuestionType=new GraphQLInputObjectType({
    name:"questioninput",
    fields: () => ({

       question:{ type: GraphQLString },
       response:{type:new GraphQLList(GraphQLString)},
       isother:{type:GraphQLBoolean},
       isrequired:{type:GraphQLBoolean},
       type:{ type: GraphQLString },
       typetext:{type: GraphQLString}
    })
});
const UserType=new GraphQLObjectType({
    name:"user",
    fields: () => ({
        id:{ type: GraphQLString },
        firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    username: { type: GraphQLString},
    birthday:{type:GraphQLString},
    email: { type: GraphQLString},
    mobile: { type: GraphQLInt},
    facebook_url: { type:GraphQLString},
    twitter_url: { type:GraphQLString},
    is_activated:{type:GraphQLBoolean},
    instagram_url: { type:GraphQLString},
    linkedin_url: { type:GraphQLString},
    address: { type:GraphQLString},
    statut:{type:GraphQLString},
    Role:{ type:GraphQLString},
    profilePic: { type: GraphQLString },
    coverPhoto: { type: GraphQLString }
    })
    
});
const ClubType=new GraphQLObjectType({
    name:"club",
    fields: () => ({
        id:{ type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        slogan: { type: GraphQLString },
        logo: { type: GraphQLString },
        form_submite:{type:new GraphQLList(form_submite_type)},
        text_submite:{type:new GraphQLList(text_submite_type)},
        check_submite:{type:new GraphQLList(check_submite_type)},
        facebook_url: { type: GraphQLString },
        twitter_url: { type: GraphQLString },
        instagram_url: { type: GraphQLString },
        linkedin_url: { type: GraphQLString },
        created_by:{type:UserType},
        inviters:{type:new GraphQLList(UserType)},
        members:{type:new GraphQLList(UserType)},
        publications:{type:new GraphQLList(pubtype)},
    })
});

const pubtype=new GraphQLObjectType({
    name:"pub",
    fields: () => ({
    article: { type: GraphQLString },
    image:{type:GraphQLString},
    club_des: {
        type: ClubType 
    },
    submit_by: {type:UserType},
    liked_by:{type:new GraphQLList(UserType)}
})
})
const form_submite_type=new GraphQLObjectType({
    name:"form_submite",
    fields: () => ({
    question:{ type: GraphQLString },
    response:{type:new GraphQLList(GraphQLString)},
    is_other:{type:GraphQLBoolean},
    is_required:{type:GraphQLBoolean}
})
})
const check_submite_type=new GraphQLObjectType({
    name:"check_submite",
    fields: () => ({
    question:{ type: GraphQLString },
    response:{type:new GraphQLList(GraphQLString)},
    is_required:{type:GraphQLBoolean}
})
})
const text_submite_type=new GraphQLObjectType({
    name:"text_submite",
    fields: () => ({
        question:{ type: GraphQLString },
        typetext:{type:GraphQLString},
        is_required:{type:GraphQLBoolean}
})
})


const Rootquery = new GraphQLObjectType({
    name: "query",
    fields: {
        clubs: {
            type: new GraphQLList(ClubType),
            resolve(parent, args) {
                return new Promise((resolve, reject) => {
                    const clubsQuery = Club.find({}).populate([{ path: "members", model: User }]).populate([{ path: "inviters", model: User }]);
                    clubsQuery.exec((err, clubs) => {
                      if (err) {
                        console.error(err);
                        reject(err);
                      } else {
                        console.log(clubs);
                        apiclub.GetClubs({ clubs: clubs }, (err, data) => {
                          if (!err) {
                            console.log(data.clubs);
                            resolve(data.clubs);
                          } else {
                            reject(new Error('Clubs not found'));
                          }
                        });
                      }
                    });
                  });
             
            }
            
        }
    }
})
const Rootmutation = new GraphQLObjectType({
    name: "mutation",
    description: "Add a club",
    fields: {
      addclub: {
        type: ClubType, // Assuming ClubType is defined somewhere else
        args: {
          club: { type: inputClubType } // Assuming ClubInputType is defined somewhere else
 // Assuming you're using graphql-upload for file uploads
        },
        resolve: async (_, { club,file}) => {
          console.log('here');
          const {
            name,
            description,
            category,
            slogan,
            questions,
            facebook_url,
            twitter_url,
            instagram_url,
            linkedin_url,
            image
          } = club;
          if(image){

              // Remove the data URL prefix from the base64 image string
              const data = base64Image.replace(/^data:image\/\w+;base64,/, '');
      
              // Create a buffer from the base64 image data
              const buffer = Buffer.from(data, 'base64');
      
              // Generate a unique filename for the image
              const filename = `${Date.now()}.png`;
      
              // Set the desired file path to save the image
              const filePath = path.join(__dirname, 'uploads', filename);
      
              // Write the buffer to the file system
              await fs.promises.writeFile(filePath, buffer);
      
              // Return the filename, file path, and MIME type of the saved image
             
          }
  
  
          // Save the file to the desired location
       
  
          // Save the club to the database using Mongoose
  
          return club;
        },
      },
    },
  });
  
module.exports = new GraphQLSchema({

    query: Rootquery,
    mutation: Rootmutation
})