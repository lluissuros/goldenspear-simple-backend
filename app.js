var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
const uuid = require("uuid/v1");
var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const exjwt = require("express-jwt");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const contacts = require("./data/contacts");

const PORT = process.env.PORT || 3001;
const SECRET = "super secret";

var app = express();

/*========= Set up lowdb database ============*/
console.log("setting up lowdb database...");
const adapter = new FileSync("data/db.json");
const db = low(adapter);
// Set some defaults (required if your JSON file is empty)
db.defaults({ users: [], contacts }).write();

/*========= Here we want to let the server know that we should expect and allow a header with the content-type of 'Authorization' ============*/
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Headers", "Content-type,Authorization");
  next();
});

/*========= This is the typical node server setup so we can be able to parse the requests/responses coming in and out of the server ============*/
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

/*========= Here we will set up an express jsonwebtoken middleware(simply required for express to properly utilize the token for requests) You MUST instantiate this with the same secret that will be sent to the client ============*/
const jwtMW = exjwt({
  secret: SECRET
});

/*=========  create new users, return jwt if success ========= */
app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    console.log("invalid username or password on signup");
    res.status(401).json({
      sucess: false,
      token: null,
      err: "Entered Password or Username are not valid"
    });
    return;
  }
 
  if(db.get("users").find({ username }).value()) {
    console.log("user already exists");
    res.status(401).json({
      sucess: false,
      token: null,
      err: "User already exists"
    });
    return;
  }

  bcrypt.hash(password, 10, function(err, hash) {
    const id = uuid();

    const token = jwt.sign(
        { username },
        SECRET,
        { expiresIn: 129600 }
      ); // Signing the token

    const newUser = { id, username, password: hash };
    db.get("users")
      .push(newUser)
      .write();

    console.log("User created: ", newUser);
    res.json({
        sucess: true,
        err: null,
        token
      });
  });
});

/* This is the route that the client will be passing the entered credentials for verification to.
 If the credentials match, then the server sends back a json response with a valid json web token for the client to use for identification. */
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log("User login submitted: ", username, password);

  const user = db.get("users").find({ username }).value();

  if (!user) {
    console.log("user is not registered");
    res.status(401).json({
      sucess: false,
      token: null,
      err: "Invalid Credentials"
    });
    return;
  }
  console.log("User Found: ", user);

  bcrypt.compare(password, user.password, function(err, result) {
    if (result === true) {
      console.log("password correct");

      const token = jwt.sign(
        { username: user.username },
        SECRET,
        { expiresIn: 129600 }
      ); // Signing the token

      res.json({
        sucess: true,
        err: null,
        token
      });
    } else {
      console.log("Entered Password and Hash do not match!");
      res.status(401).json({
        sucess: false,
        token: null,
        err: "Entered Password and Hash do not match!"
      });
    }
  });
});

app.get("/", jwtMW /* Using the express jwt MW here */, (req, res) => {
  console.log("Web Token Checked.");
  res.send("You are authenticated"); //Sending some response when authenticated
});

app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});


module.exports = app;
