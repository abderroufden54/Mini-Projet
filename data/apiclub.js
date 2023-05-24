const PROTO_PATH = "./grpc/club.proto";

const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

const clubProto = grpc.loadPackageDefinition(packageDefinition).club;
const club = new clubProto.ClubService(
  "localhost:30045",
  grpc.credentials.createInsecure()
);

module.exports = club;