require("dotenv").config();
const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const Projects = require("./model-database/projects").Projects;
const Admin = require("./model-database/admin").Admin;
const passport = require("passport");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");


const initializePassport = require("./passport-config");


initializePassport(passport);



const app = express();



app.use(express.urlencoded({ extended: true }));

// parse application/json
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());


app.use(flash());

app.use(cookieParser("secret"));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
   saveUninitialized: false,
   cookie: {
     sameSite: false, // i think this is default to false
     maxAge: 60 * 60 * 1000
   }
}));

//flash message middle ware
app.use(function(req, res, next){
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});




app.use(passport.initialize());
app.use(passport.session());











app.get("/",  function(req, res){
  res.send("welcome");
});




//get projects
app.get("/projects",  async function(req, res){

  //console.log("called");
  const projects = await Projects.find().clone();
  //console.log(projects);
  res.send(projects);

  });



//get single projects
app.get("/projects/:id",  async function(req, res){

  //console.log("called");
  const singleProject = await Projects.findById({_id: req.params.id}).clone();
  //const projects = await Projects.find().clone();
  //console.log(singleProject);
  res.send(singleProject);

  });





//save project
app.post("/project", async function(req, res){
      //console.log("called projects");
      //console.log(req.body);
    try{    
      
        //console.log(req.body.address);
        //console.log(req.body.txhash);
        let projects = new Projects({
          name: req.body.name,
          symbol: req.body.symbol,
          "logo_url": req.body.imgurl,
          description: req.body.description,
          website: req.body.website,
          ama: req.body.ama,
          votes: req.body.votes,
          facebook: req.body.facebook,
          twitter: req.body.twitter,
          instagram: req.body.instagram,
          contract: req.body.contract
        });
    
      
        projects.save();
    
  
        res.send(true);
  
  
      } catch {
      res.send(false);
      }
    
    
  
    });



 //save vote
 app.post("/vote", async function(req, res){
    
    //console.log("called add to pool progress");
    //console.log(req.body.id);


    try{    
    
      await Projects.updateOne({_id: req.body.id}, {$inc: { "votes": 1 }} ).clone();

    
      res.send(true);
  
  
      } catch {
      res.send(false);
      }

    });





  //login section
  app.post("/login", passport.authenticate("local", {
        failureFlash: true,
        failureRedirect: "/loginfailed"
    }), (req, res, next) => {
       //res.redirect('/admin');
       res.send({user: req.user})
    });

  

//login failed
app.get("/loginfailed",  async function(req, res){

  res.send(false);

  });
  
  


  //get trending
  app.get("/ama",  async function(req, res){

    //console.log("called");
    //const projects = await Projects.find({}, {_id:0}).sort({"ama": -1}).clone();
    const projects = await Projects.find({}).sort({ama: -1});

    //console.log(projects);
    res.send(projects);
  
  });
  
    
  








app.listen(process.env.PORT || 8000,  function(){
  console.log("App is listening on url http://localhost:8000");
});
