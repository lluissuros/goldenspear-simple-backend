const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const usersRoute = require("./routes/user.route");
const contactsRoute = require("./routes/contacts.route");


const PORT = process.env.PORT || 3001;
const app = express();

/*=========  we should expect and allow a header with the content-type of 'Authorization' ============*/
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Headers", "Content-type,Authorization");
  next();
});

/*=========  parse the requests/responses coming in and out of the server ============*/
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

/*========= routes ============*/
app.use("/users", usersRoute);
app.use("/contacts", contactsRoute);

app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});

module.exports = app;
