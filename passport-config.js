const LocalStrategy = require("passport-local").Strategy;
const Admin = require("./model-database/admin").Admin;



function initialize(passport){
passport.use(new LocalStrategy(  { usernameField: 'Email', passwordField: 'password',  passReqToCallback: true },
async function(req, Email, password,  done){

 //console.log("running");




   console.log("starting");
    //check for admin
    try{
   await Admin.findOne({ Email: Email }, function(err, user){
     if (err)  return done(err);
     //check if user exist
       //console.log(user);
     if(!user) {
      // console.log("user false");
       return done(null, false);
     }

          //checks for password
      else if( password == user.password){
        //  console.log("check password");
          done(null, user);
          return
        } else {
          return done(null, false);
        }


     }).clone();
   } catch(err){
     console.log(err);
     process.exit(1);
   };

 


}));
// end of user passport auth








//serialize
passport.serializeUser(function(user, done) {
  return done(null, user.id);
 });
 
 //deserialize
 passport.deserializeUser( async function(id, done) {

 try{
   await Admin.findById(id, function(err, user) {
        done(err, user);
        return
   }).clone();
 } catch(err){
  console.log(err);
 };
  //end of if of for admi
 
 
 });


}


module.exports = initialize;
