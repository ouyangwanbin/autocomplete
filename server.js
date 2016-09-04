var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var PRODUCTS_FILE = path.join(__dirname, 'products.json');
var MAX_ITEMS_LEN = 10;

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Additional middleware which will set headers that we need on each request.
app.use(function(req, res, next) {
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    next();
});

app.get('/complete', function(req, res) {
    var term = req.query.term;
    fs.readFile(PRODUCTS_FILE, function(err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        var allData = JSON.parse(data);
        var result = [];
        if (allData.products) {
            allData.products.forEach(function(item) {
                if (result.length >= MAX_ITEMS_LEN) {
                    return;
                }
                //do not add duplicate result
                if (item.name && item.name.indexOf(term) > -1 && result.indexOf( item.name ) < 0) {
                    result.push(item.name);
                }
            });
        }
        res.json(result);
    });
});

app.get('/product', function(req, res) {
    var product = req.query.name;
    var result = {};
    fs.readFile(PRODUCTS_FILE, function(err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        var allData = JSON.parse(data);
        var result = [];
        if (allData.products) {
            allData.products.forEach(function(item) {
                if( item.name === product ){
                    result = item;
                    return;
                }
            });
        }
        res.json(result);
    });
});


app.listen(app.get('port'), function() {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});
