const express = require("express")
const app = express()
const handlebars = require("express-handlebars")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const adminRoutes = require("./routes/admin")
const path = require("path")
const session = require("express-session")
const flash = require("connect-flash")

//Config

    //Session
    app.use(session({
        secret: "myapp_it@lo",
        resave: true,
        saveUninitialized: true
    }))
    
     //Flash
    app.use(flash())
    
    //Midleware
    app.use(function (req, res ,next) {
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        next()
    })

    //Body Parser
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(bodyParser.json());

    //Handlebars
    app.engine('handlebars', handlebars({defaultLayout: 'main'}));
    app.set('view engine', 'handlebars');

    //Mongoose config Data Base
    mongoose.Promise = global.Promise;
    mongoose.connect("mongodb://localhost/myapp").then(()=> {
        console.log("Conectado ao Mongo DB")
    }).catch((err)=>{
        console.log("Erro ao se conectar: "+err)
    })

    //Public
    app.use(express.static(path.join(__dirname,"public")))


//Routes
    app.get("/", function (req, res) {
        res.render("index")
    })
    app.use("/admin", adminRoutes)
    

//Port
const PORT = 8080
app.listen(PORT,()=>{
    console.log("Server executing...")
})