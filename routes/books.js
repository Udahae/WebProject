var express = require('express');
var Hosting = require('../models/Hosting');
var Room = require('../models/Room');
var router = express.Router();

function needAuth(req, res, next) {
    if (req.session.user) {
      next();
    } else {
      req.flash('danger', '로그인이 필요합니다.');
      res.redirect('back');
    }
}

router.post('/:id', needAuth, function(req, res, next) {
    Room.findById(req.params.id, function (err, room){
        var newHosting = new Hosting({
            send_email: req.session.user.email,
            take_email: room.email,
            room_id: req.params.id,
            checkin: req.body.checkin, 
            checkout: req.body.checkout,
            persons: req.body.persons,
            result: "대기중"
        });
        newHosting.save(function(err) {
        if (err) {
            return next(err);
        } else {
            req.flash('danger', '예약을 요청하였습니다.');
            res.redirect('/');
        }
        });
    });
});

router.get('/:id/accept', function(req, res, next) {
   Hosting.findById(req.params.id, function (err, hosting){
        hosting.result = "수락"
        hosting.save(function(err) {
        if (err) {
            return next(err);
        } else {
            req.flash('danger', '예약을 수락하셨습니다.');
            res.redirect('/users/detail');
        }
        });
    }); 
});

router.get('/:id/reject', function(req, res, next) {
   Hosting.findById(req.params.id, function (err, hosting){
        hosting.result = "거절"
        hosting.save(function(err) {
        if (err) {
            return next(err);
        } else {
            req.flash('danger', '예약을 거절하셨습니다.');
            res.redirect('/users/detail');
        }
        });
    }); 
});

router.delete('/:id', function(req, res, next) {
    Hosting.findOneAndRemove({_id: req.params.id}, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/users/detail');
    });
});

module.exports = router;