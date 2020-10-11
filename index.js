const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");


const PORT = 5000;

const app = express();

app.set('view engine', 'pug')

app.use(cookieParser());

app.use(
  express.urlencoded({
    extended: true
  })
);

app.use(express.static(__dirname));
app.use(bodyParser.json());

app.use("/", function (req, res, next) {
  if (!req.cookies.openedAt) {
    const now = (new Date()).toLocaleTimeString("hy-AM");
    res.cookie("openedAt", now, {
      maxAge: 60000 });
    }
  next();
});

app.get("/", function (req, res) {
  res.render('index', { title: 'Express app', message: 'Hello world !!!', timeFromCookie: req.cookies.openedAt || "No Time Cookie" });
});

app.get("/myroute/:param", function (req, res) {
  let urlParamValue;
  switch(req.params.param) {
    case 'params':
      urlParamValue = req.params.param
      break
    case 'query': 
      urlParamValue = req.query;
      break
    case 'headers': 
      urlParamValue = req.headers;
      break
    case 'cookies': 
      urlParamValue = req.cookies;
      break
    default:
      urlParamValue = "Please write 'params', 'query', 'headers' or 'cookies' ";
  }
  urlParamValue = JSON.stringify(urlParamValue);
  res.render('myroute', { title: 'Express app',  urlParamValue: urlParamValue, urlParamKey: req.params.param});
});

app.get("/form", function (req, res) {
  res.render('form');
});

const users = [];

app.post("/form", function (req, res) {
  const user = {
    username: req.body.username || "",
    password: req.body.password || "",
    gender: req.body.gender || "",
    agree: req.body.agree || false,
  }
  users.push(user);
  res.redirect('/result');
});

app.get("/result", function (req, res) {
  res.render('users', { title: 'Express app', users });
});

app.get("/api/time", function (req, res) {
  if (req.cookies.openedAt) {
    res.send(JSON.stringify({time: req.cookies.openedAt}));
  }
  else{
    res.status(404).send("No Time Cookie");
  }
});

app.get("/api/users", function (req, res) {
  res.send(users);
});

app.post("/api/users", function (req, res) {
  const { username, password, gender, agree } = req.body;
  const user = {
    username: username || "",
    password: password || "",
    gender: gender || "",
    agree: agree || false,
  }

  users.push(user);
  res.send(users);
});

app.listen(PORT, () => {console.log(`Server listening on port ${PORT}`)});
