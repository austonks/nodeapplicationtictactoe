if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const port = 3000

const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const usrs = []

//Creates and authenticates password
const createPassport = require('./passportConfig')//because it is exported as init
createPassport(
    passport,
    email => usrs.find(user => user.email === email),
    id => usrs.find(user => user.id === id)
)//initialized function that is initialize(passport, getUserByEmail, getUserbyID)

//looks for the ejs file in the view folder
app.set('view-engine','ejs')
app.use(express.urlencoded({ extended: false}))
//to send warnings that the password is incorrect
app.use(flash())
//used to save information on the server
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
//calls the func from the passportConfig.js
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

//used to check the name with is visible to the user
app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs',{name: req.user.name})
})


app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})

//1. accesses the css and the js files in the public folder
app.use(express.static('public'))
app.use('/css',express.static(__dirname + 'public/CSS'))
app.use('/js',express.static(__dirname + 'public/JS'))
app.use('/txt',express.static(__dirname + 'public/JS'))

//uses post to login and send to the index.js
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash:true
}))

//renders out register.ejs if not authenticated
app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})
//uses post to store private secure data such as passwords
app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 8)
        usrs.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.redirect('/login')    
    } catch {
        res.redirect('/register')
    }
    console.log(usrs)
})
//logs usr out
app.delete('/logout', (req, res) => {
    req.logOut(function(err){if(err){return next(err)}
    res.redirect('/login')
})
})
//function for verifying
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()){
        return next()
    }

    res.redirect('/login')
}
//function for verifying
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()){
        return res.redirect('/')
    }
    next()
}



app.listen(port, () => console.log(`Example app listening on port ${port}!`))

