var express = require('express');
var ObjectID = require('mongodb').ObjectID;
var fs =  require('fs');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hydro Data App' });
});

/* POST new res change data */
router.post('/resChange', function (req, res, next) {
    var db = req.db;
	db.collection('resChange').insert(req.body, function(err, result) {
		res.send(
			(err === null) ? {msg: 'success'} : {msg: err}
		);
	});
});

/* GET res change data */
router.get('/getData', function (req,res,next) {
    var db = req.db;
    db.collection('resChange').find().toArray(function (err, items) {
        res.json(items);
    });
});

/* update res change data */
router.post('/resChangeUpdate/:id', function (req, res, next) {
    var db = req.db;
    var update = req.params.id;
    db.collection('resChange').updateById(update, req.body, function(err, result) {
		res.send(
			(err === null) ? {msg: 'success'} : {msg: err}
		);
    });
});

/* get image album list */
router.get('/getAlbumList', function (req,res,next) {
    var db = req.db;
    db.collection('imageAlbums').find().toArray(function (err, items) {
        res.json(items);
    });
});

/* add new album */
router.post('/addAlbum', function (req, res, next) {
    var db = req.db;
    db.collection('imageAlbums').insert(req.body, function(err, result) {
		res.send(
			(err === null) ? {msg: 'success'} : {msg: err}
		);
    });
});

/* delete an album and its contents */
router.post('/deleteAlbum/:albumId', function (req,res,next) {
    var db = req.db;
    var albumId = req.params.albumId;
    var query = {'albumID':new ObjectID.createFromHexString(albumId)};
    db.collection('gardenImages').find(query).toArray(function (err, items) {
        items.forEach(function (val,i,array) {
            var path = __dirname + '/../public/uploads/' + val.fileName;
            fs.unlinkSync(path);
        });
        db.collection('gardenImages').remove(query, function (err, result) {
            db.collection('imageAlbums').removeById(albumId, function (err, result) {
                res.send(
                    (err === null) ? {msg: 'success'} : {msg: err}
                );
            });
        });
    });
});


/* get image data */
router.get('/getImageData/:albumId', function (req,res,next) {
    var db = req.db;
    var albumId = req.params.albumId;
    db.collection('gardenImages').find({'albumID':new ObjectID.createFromHexString(albumId)}).toArray(function (err, items) {
        res.json(items);
    });
});

/* delete an image */
router.post('/deleteImage', function (req, res, next) {
    var db = req.db;
    var imgId = req.body.id;
    var path = __dirname + '/../public/uploads/' + req.body.filename;
    db.collection('gardenImages').removeById(imgId, function (err, result) {
        fs.unlinkSync(path);
        res.send(
            (err === null) ? {msg: 'success'} : {msg: err}
        )
    });
});

/* upload image */
router.post('/uploadImage/:albumId', function (req,res,next) {
    var db = req.db;
    var albumId = req.params.albumId;
    var save_as = process.hrtime();
    req.pipe(req.busboy);
	req.busboy.on('file', function (fieldname, file, filename) {
        file.fileRead = [];

		file.on('data', function(data) {
			this.fileRead.push(data);
		});

		file.on('end', function() {
			buffer = Buffer.concat(this.fileRead);
			writeNow();
		});

		function writeNow() {
			var ext, filenameSplit = filename.split('.');
			var err = null; //define an error message
			ext = filenameSplit[filenameSplit.length - 1];
			var path = __dirname + '/../public/uploads/' + save_as + '.' + ext;
			fs.writeFile(path, buffer, function () {
                var data = {
                    "fileName": save_as + "." + ext,
                    "date": new Date().toDateString(),
                    "albumID": new ObjectID.createFromHexString(albumId)
                }
                db.collection('gardenImages').insert(data, function(err, result) {
            		res.send(
            			(err === null) ? {msg: 'success'} : {msg: err}
            		);
                });
			});
		}
    });
});

module.exports = router;
