var express  = require('express');
var app      = express();
var port     = process.env.PORT || 4000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var serveStatic = require('serve-static')
var session      = require('express-session');
var exphbs = require('express-handlebars');
var path = require('path');
var absolutePath = path.join.bind(path, __dirname);

var configDB = require('./config/database.js');
mongoose.connect(configDB.url);

require('./config/passport')(passport);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(serveStatic('public'));

app.engine('html', exphbs({
        extname: '.html',
        defaultLayout: 'main',
        partialsDir: [
            absolutePath('views/partials')
        ],
        helpers: require('./app/helpers')
    }
));
app.set('view engine', 'html');
app.set('views', absolutePath('views'));

app.use(session({ secret: 'holacompadrewelcometoseguir' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./app/routes.js')(app, passport);
require('./app/social.js')(app, passport);

app.listen(port);
console.log('Example Seguir Application running on http://localhost:' + port);
