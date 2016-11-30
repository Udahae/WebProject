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
router.get('/', function(req, res, next) {
  res.redirect('/');
});

router.get('/host', function(req, res, next) {
  res.render('rooms/host');
});

router.get('/detail/:id', function(req, res, next) {
  Room.findById(req.params.id, function (err, room) {
    if(err){
      return next(err);
    }
    User.findOne({email: room.email}, function(err, user) {
      if(err){
        return next(err);
      }
      res.render('rooms/detail', {room:room, user:user});
    });
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

router.delete('/:id', function(req, res, next) {
    Room.findOneAndRemove({_id: req.params.id}, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/users/detail');
    });
});

router.get('/:id/edit', function(req, res, next) {
    Room.findById({_id: req.params.id}, function(err,room) {
      if (err) {
        return next(err);
      }
      res.render('rooms/hosting', {room:room});
    });
});

router.put('/:id', function(req,res,next){
  Room.findById({_id: req.params.id}, function(err, room) {
    if (err) {
      return next(err);
    }

    if(req.session.user.email === room.email){
      room.title= req.body.title,
      room.explain= req.body.explain,
      room.city= req.body.city,
      room.address= req.body.address,
      room.pay= req.body.pay,
      room.facility= req.body.facility,
      room.rule= req.body.rule
      room.createdAt = req.body.createdAt;

      room.save(function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/rooms');
      });
    }else{
      req.flash('danger', '수정이 불가능합니다.');
      res.redirect('/');
    }
   
  });
});

module.exports = router;
