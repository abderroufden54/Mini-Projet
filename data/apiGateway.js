const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const UserProtoPath = './grpc/user.proto';
const ClubProtoPath = './grpc/club.proto';
const UserProtoDefinition = protoLoader.loadSync(UserProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  arrays:true,
  oneofs: true,
});
const UserProto = grpc.loadPackageDefinition(UserProtoDefinition).user;

const UserService = {
    GetReply: (call, callback) => {
     const message=call.request.message;
    callback(null, { message });
  },
  GetUser: (call, callback) => {
    const user=call.request.user;
   callback(null, { user });
 }
}
const server2 = new grpc.Server();
server2.addService(UserProto.UserService.service, UserService);
server2.bindAsync(`127.0.0.1:30044`, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error('Failed to bind server:', err);
    return;
  }

  console.log(`Server is running on port 30044`);
  server2.start();
});
const ClubProtoDefinition = protoLoader.loadSync(ClubProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  arrays:true,
  oneofs: true,
});
const ClubProto = grpc.loadPackageDefinition(ClubProtoDefinition).club;

const ClubService = {
    GetClubs: (call, callback) => {
     const clubs=call.request.clubs;
    callback(null, { clubs });
  },
  GetClubsdetails: (call, callback) => {
    const club=call.request.club;
   callback(null, { club });
 },
  GetCategories: (call, callback) => {
    const categories=call.request.categories;
   callback(null, { categories });
 },
 GetMessages: (call, callback) => {
  const id=call.request.id;
 callback(null, { id });
},
Getpub: (call, callback) => {
  const pub=call.request.pub;
 callback(null, { pub });
},
GetM: (call, callback) => {
  const message=call.request.message;
 callback(null, { message });
},
getclubd: (call, callback) => {
  const clubs=call.request.clubs;
 callback(null, { clubs });
}
}
const server = new grpc.Server();
server.addService(ClubProto.ClubService.service, ClubService);
server.bindAsync(`127.0.0.1:30045`, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error('Failed to bind server:', err);
    return;
  }

  console.log(`Server is running on port 30045`);
  server.start();
});

