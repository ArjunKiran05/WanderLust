const express = require('express');
const app = express();
const users = require('./routes/user');
const posts = require('./routes/post')
const cookieParser = require('cookie-parser');

app.use(cookieParser());


app.get('/getcookies',(req,res)=>{
    res.cookie("GREET","HELLO");
    res.send("sent a cookie");
})

app.get('/',(req,res)=>{
    console.dir(req.cookies);
    res.send('Hi, I am root!');
});


app.use('/users',users);
app.use('/posts',posts);


app.listen(3000,()=>{
    console.log(`server is listening at port ${3000}`);
})