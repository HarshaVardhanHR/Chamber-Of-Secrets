const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./routes/authSystem");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");
const ejsLint = require('ejs-lint');
const User= require("./models/user");
const app = express();
app.locals.data = require('./JSON/question.json');
const connection = mongoose.connection;

mongoose.connect("mongodb://localhost:27017/users", {useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true});
connection.once("open", () => {
    console.log("Mongo DB connection established!");
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({secret: "thisismysecret", resave: false, saveUninitialized: false}));
app.use(express.static(path.join(__dirname, 'public')));
//from
app.use(express.static(path.join(__dirname, 'views')));
//to
app.set("view engine", "ejs");
app.use(authRouter);
app.listen(3000);
