import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";

const PROTO_PATH = path.join(__dirname, "../protos/hello.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const grpcObject = grpc.loadPackageDefinition(packageDefinition) as any;
const greeterPackage = grpcObject.helloworld;

function sayHello(
  call: grpc.ServerUnaryCall<any, any>,
  callback: grpc.sendUnaryData<any>
) {
  console.log(`Received request: ${JSON.stringify(call.request)}`);

  const reply = { message: `Hello, ${call.request.name}!` };
  callback(null, reply);
}

function main() {
  const server = new grpc.Server();
  server.addService(greeterPackage.Greeter.service, { SayHello: sayHello });
  const port = "0.0.0.0:9001";
  server.bindAsync(port, grpc.ServerCredentials.createInsecure(), () => {
    console.log(`gRPC server running on ${port}`);
  });
}

main();
