 //jshint esversion:6
 require("dotenv").config(); 
 
 const express = require("express");
 const bodyParser = require("body-parser");
 const ejs = require("ejs");
 const mongoose = require("mongoose");
 
 // require passport and session just below mongoose
 
 const session = require('express-session');
 const passport = require("passport");
 const passportLocalMongoose = require("passport-local-mongoose");
 const GoogleStrategy = require('passport-google-oauth20').Strategy;
 const findOrCreate = require('mongoose-findorcreate');
 
 // requering security nodules
 
 const encrypt = require("mongoose-encryption");
 const _ = require("lodash");
 const md5 = require("md5");
 const bcrypt = require("bcrypt");
 const saltRounds = 1;
 
 const app = express();
 
 app.use(express.static("public"));
 app.use(bodyParser.urlencoded({extended: true}));
 app.set("view engine","ejs");
 
 // intialising session
 
 app.use(session({
     secret: 'keyboard cat',
     resave: false,
     saveUninitialized: true,
     
   }));
 
 //   intialising passport
 
   app.use(passport.initialize());
   app.use(passport.session());
 
 // console.log(md5("message"));
 mongoose.connect("mongodb+srv://admin-deepu:deepubhaiya@cluster0.ri61b.mongodb.net/userdataDB",{useNewUrlParser:true},{useUnifiedTopology: true});
 mongoose.set("useCreateIndex",true);
 
 const userSchema = new mongoose.Schema({
     username:String,
     password: String,
     googleId: String,
     secret: String
 });
 

 
 userSchema.plugin(passportLocalMongoose);
 userSchema.plugin(findOrCreate);
 
 // security set up using env
 
 // const hidden = process.env.SECRET
 
 // userSchema.plugin(encrypt,{secret : hidden , encryptedFields:["password"]})
 
 
 const User = mongoose.model("User", userSchema);
 
 // intialising to create a cookie
 
 passport.use(User.createStrategy());
 
 passport.serializeUser(function(user, done) {
     done(null, user.id);
   });
   
   passport.deserializeUser(function(id, done) {
     User.findById(id, function(err, user) {
       done(err, user);
     });
   });
 
 passport.use(new GoogleStrategy({
     clientID: process.env.CLIENT_ID,
     clientSecret: process.env.CLIENT_SECRET,
     callbackURL: "http://localhost:3000/auth/google/secrets",
     userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
   },
   function(accessToken, refreshToken, profile, cb) {
     User.findOrCreate({ googleId: profile.id }, function (err, user) {
       return cb(err, user);
     });
   }
 ));


 const assignmentSchema = new mongoose.Schema({
blogbody: String,

});

const Assignment = mongoose.model("Assignment",assignmentSchema);




// first activate and call all modules and library

const assignment1= "lorem"
 


// defining globals that can be used anywhere inside ejs on any page
const assignmentt = new Assignment({
  blogbody : assignment1
  
})



assignmentArray = [assignmentt];


const testSchema = new mongoose.Schema({
  testbody: String,
  // blogtitle: String
});

const Test = mongoose.model("Test",assignmentSchema);



// first activate and call all modules and library

const test1 = "lorem"


// defining globals that can be used anywhere inside ejs on any page
const test = new Test({
  testbody : test1 
})


testArray = [test];


const calendarSchema = new mongoose.Schema({
  calendarbody: String,
  
});

const Calendar = mongoose.model("Calendar",assignmentSchema);



// blog.save();



// first activate and call all modules and library

const calendar1 = "lorem"


// const assignment2 ="Ipsum"


// defining globals that can be used anywhere inside ejs on any page
const calendar = new Calendar({
  calendarbody : calendar1
  
})



calendarArray = [calendar];




 app.get("/",function(req,res){
     res.render("home")
 });
 
 app.get('/auth/google',
   passport.authenticate("google", { scope: ["profile"] }));
 

  //  app.get('/auth/google/secrets', 
  //  passport.authenticate('google', { failureRedirect: '/tlogin' }),
  //  function(req, res) {
  //    // Successful teacher authentication, redirect home.
  //    res.redirect('/teacherhome');
  //  });
 
   app.get('/auth/google/secrets', 
   passport.authenticate('google', { failureRedirect: '/login' }),
   function(req, res) {
     // Successful student authentication, redirect home.
     res.redirect('/homeclass');
   });

   
 
 
 app.get("/login",function(req,res){
     res.render("login")
 });
 
 app.get("/tregister",function(req,res){
  res.render("tregister")
});

app.get("/tlogin",function(req,res){
  res.render("tlogin")
});

 app.get("/register",function(req,res){
     res.render("register")
 });
 
 app.get("/homeclass",function(req,res){
     User.find({"secret":{$ne:null}},function(err,foundUser){
         if (err){
             console.log(err);
         }
         else{
             if(foundUser){
                 res.render("homeclass",{userWithsecrets: foundUser})
             }
 
         }
     })
 })

 app.get("/teacherhome",function(req,res){
  User.find({"secret":{$ne:null}},function(err,foundUser){
      if (err){
          console.log(err);
      }
      else{
          if(foundUser){
              res.render("teacherhome",{userWithsecrets: foundUser})
          }

      }
  })
})

 app.get("/assignment",function(req,res){
  Assignment.find({},function(err,foundassignments){
    if (foundassignments.length === 0){
        Assignment.insertMany(assignmentArray,function(err){
        if (err) 
         {  console.log(err);}
         else {
             console.log("assignment inserted successfully");
         }
        })
       
        res.render("assignment",{posts:foundassignments}); 
    }
    else{
        res.render("assignment",{posts:foundassignments});
    }
})

    //  res.render("assignment")
  });

 app.get("/tests",function(req,res){
  Test.find({},function(err,foundtests){
    if (foundtests.length === 0){
        Test.insertMany(testArray,function(err){
        if (err) 
         {  console.log(err);}
         else {
             console.log("test inserted successfully");
         }
        })
       
        res.render("test",{posts:foundtests}); 
    }
    else{
        res.render("test",{posts:foundtests});
    } 
});

 })

 app.get("/uploadassignment",function(req,res){
   res.render("upassign")
 })

app.get("/calendar",function(req,res){
  Calendar.find({},function(err,foundcalenders){
    if (foundcalenders.length === 0){
        Calendar.insertMany(calendarArray,function(err){
        if (err) 
         {  console.log(err);}
         else {
             console.log("calender inserted successfully");
         }
        })
       
        res.render("calendar",{posts:foundcalenders}); 
    }
    else{
        res.render("calendar",{posts:foundcalenders});
    } 
    
})
})

 
 app.post("/register",function(req,res){
     // registering user in database
     User.register({username:req.body.username},req.body.password,function(err,user){
       if(err){
           console.log(err);
           res.redirect("/register")
       }
       else{
         //   authenticating user
        passport.authenticate("local")(req,res,function(){
            res.redirect("/homeclass")
        });   
       }  
     });
 });

 app.post("/tregister",function(req,res){
  // registering user in database
  User.register({username:req.body.username},req.body.password,function(err,user){
    if(err){
        console.log(err);
        res.redirect("/tregister")
    }
    else{
      //   authenticating user
     passport.authenticate("local")(req,res,function(){
         res.redirect("/teacherhome")
     });   
    }  
  });
});
 
 app.post("/login",function(req,res){
 
 // accepting login info
 
     const user = new User({
         username:req.body.loginusername,
         password:req.body.loginpassword
     });
 
 // passport requesting user to login
 
     req.login(user,function(err){
         if(err){
             console.log(err);
         }
         // if user matches the info in database send him home page
         else{
            //  passport.authenticate("local")(req,res,function(){
                 res.redirect("/homeclass") 
        //  })
     }
 
     })
 });

 app.post("/tlogin",function(req,res){
 
  // accepting login info
  
      const user = new User({
          username:req.body.loginusername,
          password:req.body.loginpassword
      });
  
  // passport requesting user to login
  
      req.login(user,function(err){
          if(err){
              console.log(err);
          }
          // if user matches the info in database send him to secrets page
          else{
              // passport.authenticate("local")(req,res,function(){
                  res.redirect("/teacherhome") 
          // })
      }
  
      })
  });

  app.post("/teacherhome",function(req,res){
   if(req.body.pub==="submit"){
    // const newtitle = req.body.postTitle;
    const composedassignment = req.body.newAssignment;
    const newassignment = new Assignment({
        blogbody : composedassignment
    })
    newassignment.save();


res.redirect("/assignment")
  }
  if(req.body.Cpub==="Csubmit"){
 
 const composedcalender = req.body.newCalender;
 const newcalender = new Calendar({
     calenderbody : composedcalender
    
 })
 newcalender.save();


res.redirect("/calendar")

  }

if(req.body.Tpub==="Tsubmit"){

const composedtest = req.body.newTest;
  const newtest = new Test({
      testbody : composedtest
      
  })
  newtest.save();


res.redirect("/tests")
  }
 
}) 
 
 
 app.get("/submit",function(req,res){
     if(req.isAuthenticated){
         res.render("submit")
         }
         else{
             res.redirect("/login")
         }
 })
 
 app.post("/submit",function(req,res){
     const secretsubmitted = req.body.secret
     const signedInUser = req.user.id 
     console.log(signedInUser);
     
     User.findById({_id:signedInUser},function(err,foundUser){
       if (err){
           console.log(err);
       }
       else{
           if (foundUser){
               foundUser.secret = secretsubmitted;
               foundUser.save(function(){
                   res.redirect("/secrets")
               })
 
           }
       }
     })
 })
 
 app.get('/logout', function (req, res) {
     req.logOut();
     res.status(200).clearCookie('connect.sid', {
       path: '/',
       secure: false,
       httpOnly: false,
       domain: 'place.your.domain.name.here.com',
       sameSite: true,
     });
     req.session.destroy(function (err) {
       res.redirect('/');
     });
   });

  //  let port = process.env.PORT;
  //  if(port == null || port == ""){
  //      port ==3000
  //  } 
 
 
app.listen(process.env.PORT||3000, function () {
    console.log("server has started successfully");
})
 