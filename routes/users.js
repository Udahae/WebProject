var express = require('express');
var User = require('../models/User');
var Hosting = require('../models/Hosting');
var Room = require('../models/Room');
var router = express.Router();

function needAuth(req, res, next) {
    if (req.session.user) {
      next();
    } else {
      req.flash('danger', '로그인이 필요합니다.');
      res.redirect('/signin');
    }
}

function validateForm(form, options) {
  var name = form.name || "";
  var email = form.email || "";
  name = name.trim();
  email = email.trim();

  if (!name) {
    return '이름을 입력해주세요.';
  }

  if (!email) {
    return '이메일을 입력해주세요.';
  }

  if (!form.password && options.needPassword) {
    return '비밀번호를 입력해주세요.';
  }

  if (form.password !== form.password_confirmation) {
    return '비밀번호가 일치하지 않습니다.';
  }

  if (form.password.length < 6) {
    return '비밀번호는 6글자 이상이어야 합니다.';
  }

  return null;
}

/* GET users listing. */
router.get('/new', function(req, res, next) {
    res.render('users/new');
});

router.get('/:id/edit', function(req, res, next) {
   User.findById(req.params.id, function (err, user) {
    if(err){
      return next(err);
    }
    res.render('users/edit', {user:user});
  });
});

router.get('/control', function(req, res, next) {
  User.find({}, function(err, users){
    if(err){
        return next(err);
     }
     res.render('users/control',{users : users});
  });
});

router.delete('/:id', function(req, res, next) {
  User.findOneAndRemove({_id: req.params.id}, function(err){
    Room.remove({email : req.session.user.email}, function(err){
      Hosting.remove({send_email:req.session.user.email}, function(err){
        Hosting.remove({take_email : req.session.user.email}, function(err){
          if(err){
          return next(err);
          }
          delete req.session.user;
          res.redirect('/');
        });
      });
    });
  });
});

router.delete('/:id/clear', function(req, res, next) {
  User.findOne({_id: req.params.id}, function(err, user){
    Room.remove({email : user.email}, function(err){
      Hosting.remove({send_email:user.email, take_email : user.email}, function(err){
        Hosting.remove({take_email : req.session.user.email}, function(err){
          User.remove({_id: req.params.id}, function(err){
            if(err){
              return next(err);
            }
            res.redirect('/');
          }); 
        });
      });
    });
  });
});

router.get('/detail', function(req, res, next) {
  Room.find({email:req.session.user.email}, function(err, rooms){
    if(err){
        return next(err);
     }
     Hosting.find({send_email:req.session.user.email}, function(err, Hostings){
        if(err){
          return next(err);
        }
        Hosting.find({take_email:req.session.user.email}, function(err, Hosts){
          if(err){
            return next(err);
          }
          User.findOne({email:req.session.user.email}, function(err, user){
            if(err){
              return next(err);
            }
            res.render('users/detail', {rooms:rooms, hostings : Hostings, hosts:Hosts, user:user});
          });          
        });
     });   
  });
});

router.post('/', function(req, res, next) {
  var err = validateForm(req.body, {needPassword: true});
  if (err) {
    req.flash('danger', err);
    return res.redirect('back');
  }
  User.findOne({email: req.body.email}, function(err, user) {
    if (err) {
      return next(err);
    }
    if (user) {
      req.flash('danger', '동일한 이메일 주소가 이미 존재합니다.');
      res.redirect('back');
    }
    var newUser = new User({
      name : req.body.name,
      email: req.body.email,
      phonenumber: req.body.phonenumber,
      address: req.body.address,
      password: req.body.password
    });

    newUser.save(function(err) {
      if (err) {
        return next(err);
      } else {
        req.flash('success', '가입이 완료되었습니다. 로그인 해주세요.');
        res.redirect('/');
      }
    });
  });
});


/////////////
router.put('/:id', function(req, res, next) {
  var err = validateForm(req.body);
  if (err) {
    req.flash('danger', err);
    return res.redirect('back');
  }

  User.findById({_id: req.params.id}, function(err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash('danger', '존재하지 않는 사용자입니다.');
      return res.redirect('back');
    }

    if (user.password !== req.body.current_password) {
      req.flash('danger', '현재 비밀번호가 일치하지 않습니다.');
      return res.redirect('back');
    }

    user.name = req.body.name;
    user.address = req.body.address;
    user.phonenumber = req.body.phonenumber;
    if (req.body.password) {
      user.password = req.body.password;
    }

    user.save(function(err) {
      if (err) {
        return next(err);
      }
      req.flash('success', '사용자 정보가 변경되었습니다.');
      res.redirect('/');
    });
  });
});
module.exports = router;
