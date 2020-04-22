const User = require("../models/user");
const bcrypt = require('bcryptjs');
const nodemailer  = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const transporter = nodemailer.createTransport(sendgridTransport({
    auth : {
            api_key :'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'//this api key from sendgrip website login and get api from it you can use any website  

    }
}));
const ITEMS_PER_PAGE=5;


exports.addUserForm = (req, res, next) => {
    res.render('addUserForm', {
        //csrfToken: res.locals.csrfToken
    });
};
//from
exports.addUser = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const contact = req.body.contact;
    const college = req.body.college;
   bcrypt.hash(password, 12)
              .then(hashedPassword => {//hashed password from bcrpt because we give a promise
                const user = new User({
                    name: name, email: email, password: hashedPassword, contact: contact, college: college ,created_at:Date.now() 
                });
                return user.save();
              })
              .then(result => {
                res.locals.session.email = email,
                //res.render("franchiseSelector");
                res.setHeader(
                    "Access-Control-Allow-Methods",
                    "GET, POST, PATCH, DELETE, OPTIONS"
                  );
                res.redirect("/franchise/");
               return transporter.sendMail({
                   to: email,
                   from: 'itrix@chamber_of_secrets.com',
                   subject: 'Signup succeeded!',
                   html: '<h1>You successfully signed up!</h1>'
                 });
              })
              .catch(err => {
                console.log(err); 
              });
   
    
};

exports.loginForm = (req, res, next) => {
    if(res.locals.session.email)
     { 
        res.setHeader(
            "Access-Control-Allow-Methods",
            "GET, POST, PATCH, DELETE, OPTIONS"
        ); 
        res.redirect("/");
}
    res.render("loginForm", {
        message: ""
    });
};
exports.finish = (req, res, next) => {
  
    res.render('finish');
};
//to
//from
exports.loginCheck = (req, res, next) => {
   
      const email=req.body.email
      const password= req.body.password;
     
        User.findOne({email:email})
        .then(user => {
            bcrypt
            .compare(password,user.password)
            .then(doMatch=>{
                if(doMatch){
                    res.locals.session.loginFail = 0;
                    res.locals.session.email = req.body.email;
                    res.redirect("/");
                }
                else{
                    res.locals.session.loginFail = 1;
                    res.setHeader(
                        "Access-Control-Allow-Methods",
                        "GET, POST, PATCH, DELETE, OPTIONS"
                    ); 
                    res.redirect("/");
                }
            })
            .catch(err=>
                {
               console.log('err');
               res.setHeader(
                "Access-Control-Allow-Methods",
                "GET, POST, PATCH, DELETE, OPTIONS"
            ); 
               res.redirect('/');
                });
            })
          
        .catch(err => {
            console.log(err);
        });
};
//to
exports.loggedPage = (req, res, next) => {
    User.find({email: res.locals.session.email})
    .then(user => {
        const jsonFile = require("../JSON/question.json");
        const q = jsonFile[user[0].level - 1]; 
       if(user[0].level==8)
        {
            res.setHeader(
                "Access-Control-Allow-Methods",
                "GET, POST, PATCH, DELETE, OPTIONS"
              );
            res.redirect('/finish');
        }
        else
        {
            res.render("logged", {         
                loggedUser: user,
                level: user[0].level,
                question: q
            });
        
        }
        
    })
    .catch(err => {
        console.log(err);
    });
};

exports.landingPage = (req, res, next) => {

   
    User.findOne({email:req.session.email})
 .then(user=>{
         
         if(req.session.email)
{
         if(user.franchise==null&&user.player1==null)
         
          res.setHeader(
            "Access-Control-Allow-Methods",
            "GET, POST, PATCH, DELETE, OPTIONS"
          );
          res.redirect("/franchise/");
         
        
}
         else
        { 
            var login_error = "";
            if(res.locals.session.loginFail === 1){
                login_error = "Incorrect username/password";
            }
            res.render("landingPage", {
                loginFail: res.locals.session.loginFail,
                login_error: login_error
            });
            res.locals.session.loginFail = 0;
     }
    })
     .catch(err=>
        {
       console.log(err);
        }); 
}
exports.findtime = (req, res, next) => {

    User.findOne({email: res.locals.session.email})
    .then(user => {
        var i = user.level - 1;    
        const jsonParsed = require("../JSON/hint.json");
        res.json({ht1:jsonParsed[i].ht1,ht2:jsonParsed[i].ht2,ht3:jsonParsed[i].ht3 });
         });

}

exports.findhint = (req, res, next) => {

    User.findOne({email: res.locals.session.email})
    .then(user => {
        const num = res.locals.num;
        const jsonParsed = require("../JSON/hint.json");
        if(num==1)
        {
            res.json({hint1: jsonParsed[user.level-1].hint1 });
        }
        else if(num==2)
        {
            res.json({hint2: jsonParsed[user.level-1].hint2 });
        }
        else
        {
            res.json({hint3: jsonParsed[user.level-1].hint3 });
        }
        
                
         });

}        
exports.validateAnswer = (req, res, next) =>
{
 
    User.findOne({email: res.locals.session.email})
    .then(user => {
        const tex = res.locals.text;
        const jsonParsed = require("../JSON/question.json");
        if (jsonParsed[user.level-1].answer === tex) {
            const jspl=require("../JSON/player.json");
            var num;
            var random =  Math.floor((Math.random() * 4) + 0);
            switch(user.franchise)
            {
                case "kkr" :num=0;break;
                case "rcb" :num=1;break;
                case "csk" :num=2;break;
                case "srh" :num=3;break;
                case "mi" :num=4;break;
            }
            while(random==num)
            {
                random =  Math.floor((Math.random() * 4) + 0)
            }
    
            var gifPath;
            for(k=0;k<5;k++)
                if(jspl[k].team === user.franchise)
                    break;
         
                    if(user.level === 1||user.level === 4||user.level === 7)
                        gifPath=jspl[k].gif[user.player1];
                    else if(user.level === 2||user.level === 5||user.level === 8)
                        gifPath=jspl[k].gif[user.player2];
                    else if(user.level === 3||user.level === 6||user.level === 9)
                        gifPath=jspl[k].gif[user.player3];      
            if(user.level==7)
            {
                res.json({ data: "1",num: 7,redirect:jsonParsed[user.level-1].redirect });
                var myquery = { email: res.locals.session.email };
                var newvalues = { $set: {level: user.level+1 } };
                User.updateOne(myquery, newvalues, function(err, res){
                    if(err) throw err;
                });
            }
            else if(user.level!=7)
            {
               
                res.json({ data: "1",num:1, path: jsonParsed[user.level].question,level :user.level, number:user.level+1,  gif:gifPath, oppTeam : jspl[random] , curTeam : jspl[num] }); 
                var myquery = { email: res.locals.session.email};
                var newvalues = { $set: {level: user.level+1,updated_at:Date.now() } };
                User.updateOne(myquery, newvalues, function(err, res){
                    if(err) throw err;
                });
            }
            }
            else {
             
                res.json({ data: "0" });
            }  
    });
    
   
}

exports.checkEmail = (req, res, next) => {
    User.findOne({email: res.locals.email})
    .then(user => {
        if(user != null){
            res.json({message: "Email already exists"});
        }
        else{
            res.json({message: ""});
        }
    });
}
exports.leaderthree=(req,res,next)=>
{
    User.find().sort([["level","descending"],["updated_at","ascending"]]).limit(3)
    .then(user=>
        {
        
            
            res.json({onename:user[0].name,onelevel:user[0].level,oneteam:user[0].franchise, twoname:user[1].name,twolevel:user[1].level,twoteam:user[1].franchise,threename:user[2].name,threelevel:user[2].level,threeteam:user[2].franchise });
          
        })
     .catch(err=>
        {
       console.log(err);
        });   
}

exports.myrankee=(req,res,next)=>
{
    email= res.locals.session.email;
    User.find().sort([["level","descending"],["updated_at","ascending"]])
    .then(users=>
        {
            let i;
            var number;
            var teame;
            var namee;
            var levele;
            for(i=0;i<users.length;i++)
            {
                if(users[i].email===email)
                {
                    
                    number=i+1;
                    teame= users[i].franchise;
                    namee= users[i].name;
                    levele =users[i].level;
             
                }
            }
            res.json({num:number,team:teame,name:namee,level:levele});
        })
     .catch(err=>
        {
              console.log(err);
        });   
}

exports.leader =(req,res,next)=>
{
      var email= res.locals.session.email 
     const page = +req.query.page || 1;
    
     let totalItems;
     User.find().countDocuments()
     .then(numProducts => {
        totalItems = numProducts;
        return User.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE).sort([["level","descending"],["updated_at","ascending"]]);
      })
      .then(users =>{
        
    
          res.render('leader',{
          prods: users,
          pagetitle: 'leaderboard',
          mail:email,
          currentPage: page,
          count:((page-1)*5),
          hasNextPage: ITEMS_PER_PAGE * page < totalItems,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
        });
      })
      .catch(err => {
        console.log(err);
      });

    
}
exports.develop =(req,res,next)=>
{
    res.render("developer");
}
exports.rules=(req,res,next)=>
{
    res.render("rules");
}


exports.addPlayer= (req,res,next)=>{
}

exports.addFranchise= (req,res,next)=>{
    const tex = res.locals.franchise;
      
     var myquery = { email: res.locals.email };
                var newvalues = { $set: {franchise: tex} };
                User.updateOne(myquery, newvalues, function(err, res){
                    if(err) throw err;
                });
                     User.findOne({email: res.locals.email})
        .then(user => {
            
            })
            var i=0;
        const jsonParsed = require("../JSON/player.json");
        for(i=0;i<5;i++)
        if (jsonParsed[i].team === tex) {
                res.json({ data: "1",team: jsonParsed[i].team_name,pla_name: jsonParsed[i].pla_name,pla_photo:jsonParsed[i].pla_photo});
            }         
}
exports.franchise = (req, res, next) => {
    if(req.session.email)
    {
        User.findOne({email:req.session.email})
        .then(user=>
            {
                if(user.franchise!=null&&user.player1!=null)
                {
                    res.setHeader(
                        "Access-Control-Allow-Methods",
                        "GET, POST, PATCH, DELETE, OPTIONS"
                    );           
                    res.redirect("/logged");
                }
                else{
                    
                    res.render("franchiseSelector");
                }
            })
            .catch(err=>
            {
             console.log(err);
            })
    }
}