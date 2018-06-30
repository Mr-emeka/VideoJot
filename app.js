const express = require('express');

const exphbs = require('express-handlebars');

const path = require('path');

const methodOverride = require('method-override');

const flash = require('connect-flash');

const session = require('express-session');

const bodyParser = require('body-parser');

const passport = require('passport');

const mongoose = require('mongoose');

const app = express();

//DB Config
const db = require('./config/database');

mongoose.connect(db.MongoURI, {

    }).then(() => console.log('mongodb connected...'))
    .catch(err => console.log(err));

//load idea model
require('./models/idea');

const Idea = mongoose.model('ideas');

//load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//passport config
require('./config/passport')(passport);

//bootstrap
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS

//static folder
app.use(express.static(path.join(__dirname, 'public')));

//handlebar middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'

}));
app.set('view engine', 'handlebars');

//body-parser middleware
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

//Express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true }
}));

//passport always put after session
app.use(passport.initialize());
app.use(passport.session());

//flash middleware
app.use(flash());

//method override middle ware
app.use(methodOverride('_method'));

//Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();

});



//home route
app.get('/', (req, res) => {
    const title = 'Welcome';
    res.render('index', {
        title: title
    });

});

//about route
app.get('/about', (req, res) => {
    res.render('about');

});



//Use routes
app.use('/ideas', ideas);
app.use('/users', users);

// const Port = process.env.PORT || 5000;

// app.listen(process.env.PORT || 3000, (err) => {
//     if(err) throw err
//     console.log(`app started on port  ${Port}`);

// })

app.listen(process.env.PORT || 3000, function() {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});