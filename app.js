import express from "express";
const app = express();
import exphbs from "express-handlebars";

import { dirname } from "path";
import path from "path";
import { fileURLToPath } from "url";
import configRoutes from "./routes/index.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const staticDir = express.static(__dirname + "/public");
app.use("/public", staticDir);
app.use(express.json());
import session from "express-session";
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(
  session({
    name: "AwesomeWebApp",
    secret: "This is a secret.. shhh don't tell anyone",
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 1800000 },
  })
);

app.use('/', (req, res, next) => {
  if (!req.session.user) {
      console.log(new Date().toUTCString(), req.method, req.originalUrl, "(Non-Authenticated User)");
      if (req.originalUrl === '/') {
          res.redirect("/movies");
      }
      else{
        next();
      }
  }
 
  if (req.session.user) {
      console.log(new Date().toUTCString(), req.method, req.originalUrl, "(Authenticated User)");
      if(req.originalUrl === '/'){
          if (req.session.user.isAdmin) {
              res.redirect("/admin");
          }
          else
          res.redirect("/home");
      }
      else
          next();
  }
})

app.use('/login', (req, res, next) => {
  if (req.method === 'GET') {
      if (req.session.user) {
          if (req.session.user.isAdmin) {
              res.redirect("/admin");
          }
          else
          res.redirect("/home");
      }
      else
          next();
  }
  else
      next();
})

app.use('/register', (req, res, next) => {
  if (req.method === 'GET') {
      if (req.session.user) {
          if (req.session.user.isAdmin) {
              res.redirect("/admin");
          }
          else
          res.redirect("/home");
      }
      else
          next();
  }
  else
      next();
})

app.use('/users', (req, res, next) => {
  if (req.method === 'GET') {
      if (req.session.user) {
          next();
      }
      else
          res.redirect("/login");
  }
  else
      next();
})

app.use('/admin', (req, res, next) => {
  if (req.method === 'GET') {
      if (req.session.user) {
          if (!req.session.user.isAdmin) {
              res.redirect("/home");
          }
          else
              next();
      }
      else
          res.redirect("/login");
  }
  else
      next();
})
app.use('/movies', (req, res, next) => {
  if(req.method === "GET"){
    if(req.session.user && req.originalUrl === "/movies"){
      console.log(req.originalUrl);
      res.redirect('/home');
    }
    else{
      next()
    }
  }
  else{
    next();
  }
})
app.use('/watchlist',(req, res, next)=> {
  if(req.method === "GET"){
    if(!req.session.user){
      res.redirect('/movies');
    }
    else{
      next();
    }
  }
  else{
    next();
  }
})

app.use('/logout', (req, res, next) => {
  if (req.method === 'GET') {
      if (req.session.user) {
          next();
      }
      else
          res.redirect("/login");
  }
  else
      next();
})

configRoutes(app);
app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
