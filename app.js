var express = require('express')
var bodyParser = require('body-parser')
var nodemailer= require('nodemailer')
var multer= require('multer')
const fs=require('fs')

const app=express()
//view engine setup
// app.engine('handlebars', Express-Handlebars())
app.set('view engine','handlebars')

var to;
var subject;
var body;
var path;

var Storage=multer.diskStorage({
    destination:function(req,file,callback){
        callback(null,'./images')
    },
    filename:function(req,file,callback){
        callback(null,file.fieldname+"_"+file.originalname)
    }
})

var upload=multer({
    storage:Storage
}).single('image');


//body parser setup
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/',()=>{
    res.sendFile('/index.html')
})

app.post("/sendemail",(req,res)=>{
    upload(req,res,function(err){
        if(err){
            console.log(err)
            return res.end("something went wrong")
        }else
        {
            to=req.body.to
            subject=req.body.subject
            body=req.body.body
            path=req.file.path
            console.log(to)
            console.log(subject)
            console.log(body)
            console.log(path)

            var transport=nodemailer.createTransport({
                service:'gmail',
                host:"smtp.gmail.com",
                port:465,
                secure:true,
                auth:{
                    user:"kushyashsingh2@gmail.com",
                    pass:"adtcswcjuqtbjefg",
                }
            })
            var mailOptions={
                from:"kushyashsingh2gmail.com",
                to:to,
                subject:subject,
                text:body,
                attachments:[
                    {
                    path:path
                }
            ]
            }
            transport.sendMail(mailOptions,function(err,info){
                if(err){
                    console.log(err)
                }else{
                    console.log("email Sent"+ info.response)

                    fs.unlink(path,function(err){
                        if(err){
                            return res.end(err)
                        }else{
                            return res.redirect('/result.html')
                        }
                    })
                }
            })
        }
    })
})

app.listen(5000, ()=>{
    console.log('Server is up')
}) 