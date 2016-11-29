var express = require('express');
var User = require('../models/User');
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

router.get('/detail', function(req, res, next) {
  Room.find({email:req.session.user.email}, function(err, rooms){
    if(err){
        return next(err);
     }
     res.render('users/detail',{rooms : rooms});
  })
 // res.render('users/detail');
});

router.get('/hostingroom', function(req, res, next) {
  Room.find({email:req.session.user.email}, function(err, rooms){
    if(err){
        return next(err);
     }
     res.render('users/hostingroom',{rooms : rooms});
  })
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
module.exports = router;
