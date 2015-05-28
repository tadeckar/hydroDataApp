var express = require('express');
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

module.exports = router;
