const express = require('express');
const app = express();
const users = require('./routes/user');
const posts = require('./routes/post')
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');


const sessionOptions = {
    secret: "mysupersecretstring", 
    resave: false, 
    saveUninitialized: true
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(session(sessionOptions));
app.use(flash());


app.get("/register",(req,res)=>{
    let {name = 'anony'} = req.query;
    req.session.name = name;
    req.flash('success',"user registered successfully");
    res.redirect('/hello');
});

app.get("/hello",(req,res)=>{
    res.render('page.ejs',{name: req.session.name,msg: req.flash("success")});
});

// app.get('/reqcount',(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }
//     res.send(`You sent a request ${req.session.count} times`);
// });

// app.get("/test",(req,res)=>{
//     res.send("Test Successful");
// });




app.listen(3000,()=>{
    console.log(`server is listening at port ${3000}`);
});





//app.use(cookieParser());
// app.get('/getcookies',(req,res)=>{
//     res.cookie("GREET","HELLO");
//     res.send("sent a cookie");
// })

// app.get('/',(req,res)=>{
//     console.dir(req.cookies);
//     res.send('Hi, I am root!');
// });


// app.use('/users',users);
// app.use('/posts',posts);

