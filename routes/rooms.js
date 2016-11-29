var express = require('express');
var User = require('../models/User');
var Room = require('../models/Room');
var router = express.Router();

function needAuth(req, res, next) {
    if (req.session.user) {
      next();
    } else {
      req.flash('danger', '로그인이 필요합니다.');
      res.redirect('/rooms/host');
    }
}
/* GET home page. */
router.get('/host', function(req, res, next) {
  res.render('rooms/host');
});
// User를 찾는거 물어보기!!!!!!!!!!
router.get('/detail/:id', function(req, res, next) {
  Room.findById(req.params.id, function (err, room) {
    var ower;
    if(err){
      return next(err);
    }
    User.findOne({email: room.email}, function(err, user) {
      if(err){
        return next(err);
      }
      ower=user;
    });
    res.render('rooms/detail', {room:room, ower:ower});
  });
});

router.get('/hosting',needAuth, function(req, res, next) {
  res.render('rooms/hosting');
});

router.post('/', function(req, res, next) {
    var newRoom = new Room({
      email: req.session.user.email,
      title: req.body.title,
      explain: req.body.explain,
      city: req.body.city,
      address: req.body.address,
      pay: req.body.pay,
      facility: req.body.facility,
      rule: req.body.rule
    });

    newRoom.save(function(err) {
      if (err) {
        return next(err);
      } else {
        res.redirect('/');
      }
    });
});

router.get('/:id', function(req, res, next) {
    Room.findOneAndRemove({_id: req.params.id}, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/users/hostingroom');
    });
});
module.exports = router;
