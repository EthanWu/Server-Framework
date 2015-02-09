var logger = require('./logger');
var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var morganLogger = require('morgan');
var cookieParser = require('cookie-parser');
var cookieSession = require('express-session');
var bodyParser = require('body-parser');

var app = express();

app.set('port', process.env.PORT || 4000);
app.use(morganLogger('dev'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(cookieParser('S3CRE7'));
app.use(cookieSession({secret: 'ssshhhhh'}));
app.use(express.static(path.join(__dirname, 'public')));

var routes = require('./routes');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    if (err) {
        res.status(500).send('500 status');
    }
    logger.error(err.message);
    logger.error(err);
});

var models = require("./models");
models.sequelize.sync().then(function () {
    var server = app.listen(app.get('port'), function () {
        logger.info('Express server listening on port ' + server.address().port);
    });
})
