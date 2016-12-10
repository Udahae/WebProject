var express = require('express');
var User = require('../models/User');
var Room = require('../models/Room');
var Commend = require('../models/Commend');
var multer  = require('multer'),
    path = require('path'),
    _ = require('lodash'),
    fs = require('fs'),
    upload = multer({ dest: 'tmp' });
var router = express.Router();
var mimetypes = {
  "image/jpeg": "jpg",
  "image/gif": "gif",
  "image/png": "png"
};

function needAuth(req, res, next) {
    if (req.session.user) {
      next();
    } else {
      req.flash('danger', '로그인이 필요합니다.');
      res.redirect('/');
    }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/');
});

router.get('/host', function(req, res, next) {
  res.render('rooms/host');
});

router.post('/search', function(req, res, next) {
  Room.find({city:req.body.city}, function(err, rooms){
    res.render('rooms/search', {rooms:rooms, city:req.body.city})
  });
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
      Commend.find({room_id:req.params.id}, function(err, commends){
        if(err){
          return next(err);
       }
       res.render('rooms/detail', {room:room, user:user, commends:commends});
      });
    });
  });
});

router.get('/hosting',needAuth, function(req, res, next) {
  res.render('rooms/hosting',{room:req.body});
});

router.post('/:id/commends', needAuth,function(req, res, next) {
  var newCommend = new Commend({
    room_id : req.params.id,
    reviewer : req.session.user.email,
    content : req.body.content,
    createdAt : req.body.createdAt
  })

  newCommend.save(function(err){
    if(err){
      return next(err)
      
    }
    Room.findByIdAndUpdate(req.params.id, {$inc: {numComment: 1}}, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/rooms/detail/' + req.params.id);
    });
  })
});

router.post('/',upload.array('photos'), function(req, res, next) {
    var dest = path.join(__dirname, '../public/images/');
    var images = [];
    if (req.files && req.files.length > 0) {
      _.each(req.files, function(file) {
        var ext = mimetypes[file.mimetype];
        if (!ext) {
          return;
        }
        var filename = file.filename + "." + ext;
        fs.renameSync(file.path, dest + filename);
        images.push("/images/" + filename);
      });
    }
    var newRoom = new Room({
      email: req.session.user.email,
      title: req.body.title,
      explain: req.body.explain,
      city: req.body.city,
      address: req.body.address,
      images: images,
      pay: req.body.pay,
      facility: req.body.facility,
      rule: req.body.rule,
      createdAt: req.body.createdAt
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
    var dest = path.join(__dirname, '../public/images/');
    var images = [];
    if (req.files && req.files.length > 0) {
      _.each(req.files, function(file) {
        var ext = mimetypes[file.mimetype];
        if (!ext) {
          return;
        }
        var filename = file.filename + "." + ext;
        fs.renameSync(file.path, dest + filename);
        images.push("/images/" + filename);
      });
    }
    if(req.session.user.email === room.email){
      room.title= req.body.title,
      room.explain= req.body.explain,
      room.city= req.body.city,
      room.address= req.body.address,
      room.images= images,
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
