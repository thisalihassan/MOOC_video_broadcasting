var port = process.env.PORT || 8001;
var axios = require("axios");
var server = require("http"),
  url = require("url"),
  path = require("path"),
  fs = require("fs");
var multer = require("multer");
var fileupload = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "mooc",
  api_key: "265854168759756",
  api_secret: "eSdb4VE70MLDyUXw3Pv9f7abuPY",
});
function serverHandler(request, response) {
  try {
    response.setHeader("Access-Control-Allow-Origin", true);
    response.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );

    // Request headers you wish to allow
    response.setHeader(
      "Access-Control-Allow-Headers",
      "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization"
    );
    // Set to true if you need the website to include cookies in the requests sent
    response.setHeader("Access-Control-Allow-Credentials", true);
    var uri = url.parse(request.url).pathname,
      filename = path.join(process.cwd(), uri);

    var isWin = !!process.platform.match(/^win/);

    if (
      filename &&
      filename.toString().indexOf(isWin ? "\\uploadFile" : "/uploadFile") !=
        -1 &&
      request.method.toLowerCase() == "post"
    ) {
      uploadFile(request, response);
      return;
    }

    var stats;

    try {
      stats = fs.lstatSync(filename);
    } catch (e) {
      console.log(e);
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
    console.log(e);
  }
}

var app = server.createServer(serverHandler);

function runServer() {
  app = app.listen(port, process.env.IP || "0.0.0.0", function () {
    var addr = app.address();

    if (addr.address === "0.0.0.0") {
      addr.address = "localhost";
    }

    console.log("Server listening at http://" + addr.address + ":" + addr.port);
  });
}
var fileuploads = multer({ storage: fileupload }).single("file");
function uploadFile(request, response) {
  fileuploads(request, response, async function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      return response.writeHead(500);
    } else if (err) {
      console.log("Here??");
      console.log(err);
      return response.writeHead(500);
    }

    try {
      const path = request.file.path;

      var splitname = request.file.filename.split("(+)");
      const uniqueFilename = new Date().toISOString();
      const result = await cloudinary.uploader.upload(path, {
        resource_type: "auto",
        public_id: `lectures/${uniqueFilename}`,
      });

      var url = result.secure_url;
      var room = splitname[0];
      console.log(room + "room");
      const body = JSON.stringify({ url, room });
      const config = { headers: { "Content-Type": "application/json" } };

      axios.post(
        "https://moocback.herokuapp.com/api/Courses/uploadStream",
        body,
        config
      );
      console.log(url);
      return response;
    } catch (err) {
      console.log(err.message);
    }
    // try {
    //   const path = req.file.path;
    //   const uniqueFilename = new Date().toISOString();
    //   const result = await cloudinary.uploader.upload(path, {
    //     public_id: `profile/${uniqueFilename}`,
    //   });
    //   url = result.secure_url;
    // } catch (err) {
    //   console.error(err.message);
    //   res.status(500).send("Server Error");
    // }
  });
  // // parse a file upload
  // var mime = require("mime");
  // var formidable = require("formidable");
  // var util = require("util");

  // var form = new formidable.IncomingForm()
  //   .parse(request)
  //   .on("file", function (name, file) {
  //     console.log("Got file:", name);
  //   });

  // var dir = !!process.platform.match(/^win/) ? "\\uploads\\" : "/uploads/";

  // form.uploadDir = __dirname + dir;
  // form.keepExtensions = true;
  // form.maxFieldsSize = 10 * 1024 * 1024;
  // form.maxFields = 1000;
  // form.multiples = false;

  // form.parse(request, function (err, fields, files) {
  //   // var file = util.inspect(files);
  //   // console.log(file);
  //   // var fileName = file.fileName;
  //   var fileURL = "http://" + app.address + ":" + port + "/uploads/";

  //   console.log("fileURL: ", fileURL);
  // });
}
runServer();
