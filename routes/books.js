var express = require('express');
var Hosting = require('../models/Hosting');
var Room = require('../models/Room');
var router = express.Router();

router.post('/:id', function(req, res, next) {
    Room.findById(req.params.id, function (err, room){
        var newHosting = new Hosting({
            send_email: req.session.user.email,
            take_email: room.email,
            room_id: req.params.id,
            checkin: req.body.checkin, 
            checkout: req.body.checkout,
            persons: req.body.persons,
            result: "wait"
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

router.delete('/:id', function(req, res, next) {
    Hosting.findOneAndRemove({_id: req.params.id}, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/users/detail');
    });
});

module.exports = router;