'use strict';
/* jshint node:true */

var express         = require('express'),
    morgan          = require('morgan'),
    stylus          = require('stylus'),
    cookieParser    = require('cookie-parser'),
    bodyParser      = require('body-parser'),
    webpack         = require('webpack'),
    path            = require('path');

var app = express();

// if (process.env.NODE_ENV === 'dev') {

    // compiles stylus files to css on the fly
    app.use(stylus.middleware({

        src: path.join(__dirname, '/client/'),
        dest: path.join(__dirname, '/public/'),
        compress: true,
        serve: true

    }));

    // webpack files on the fly too
    var webpackCompiler = webpack({

        context: path.join(__dirname, '/client'),
        entry: './index.js',
        output: {
            path: __dirname + '/public',
            filename: 'bundle.js'
        }

    });

    app.use(function(req, res, next) {

        webpackCompiler.run(function (err, stats) {

            if (err) console.log(err);
            // console.log(stats);
            next();

        });

    });
// }


app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname + '/public')));


var port = process.env.PORT || 8080;

app.listen(port, function() {
    console.log('Server started on port ' + port);
});