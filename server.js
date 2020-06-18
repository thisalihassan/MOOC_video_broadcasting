var port = process.env.PORT || 8001;

var server = require("http"),
  url = require("url"),
  path = require("path"),
  express = require("express"),
  cors = require("cors");
fs = require("fs");
var whitelist = [
  "https://smartzoom.herokuapp.com/",
  "https://moocfyp.herokuapp.com/",
];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  "Access-Control-Allow-Headers":
    "Origin, X-Requested-With, Content-Type, Accept",
};
const app = express();
app.use(cors(corsOptions));
app.use(express.json({ extended: false }));
app.get("/", (request, response) => {
  try {
    // response.setHeader("Access-Control-Allow-Origin", true);
    // response.setHeader(
    //   "Access-Control-Allow-Methods",
    //   "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    // );

    // // Request headers you wish to allow
    // response.setHeader(
    //   "Access-Control-Allow-Headers",
    //   "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization"
    // );
    // // Set to true if you need the website to include cookies in the requests sent
    // response.setHeader("Access-Control-Allow-Credentials", true);
    var uri = url.parse(request.url).pathname,
      filename = path.join(process.cwd(), uri);
    var stats;

    try {
      stats = fs.lstatSync(filename);
    } catch (e) {
      console.log("error");
    }

    if (fs.statSync(filename).isDirectory()) {
      filename += "/index.html";
    }
    fs.readFile(filename, "utf8", function (err, file) {
      response.writeHead(200);
      response.write(file, "utf8");
      response.end();
    });
  } catch (e) {
    console.log("error");
  }
});

var html = server.createServer(app);

function runServer() {
  html = html.listen(port, process.env.IP || "0.0.0.0", function () {
    var addr = html.address();

    if (addr.address === "0.0.0.0") {
      addr.address = "localhost";
    }

    console.log("Server listening at http://" + addr.address + ":" + addr.port);
  });
}

runServer();
