const { Router } = require("express");
const router = Router();
const Article = require('../model/article');
const User = require('../model/user');
const verify = require('./verifyToken');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Main page
router.get('/', async (req, res) => {
  const token = req.cookies.token;
  console.log(JSON.stringify(token));
  const post = await Article.find({});
  return res.render('main', { pageTitle: "My Blog", post, token})
});

router.get('/theme/:theme', async (req, res) => {
  const post = await Article.find({theme: req.params.theme});
  res.render('main', { pageTitle: req.params.theme, post });
});

// Articles page
router.get('/addpost', verify, (req, res) => {
  res.render('addpost', { pageTitle: "Добавление поста" })
});

router.post('/create', verify, async (req, res) => {
  const model = new Article({
    head: req.body.postHead,
    text: req.body.postText,
    theme: req.body.theme
  });

  await model.save();
  res.redirect('/')
});

router.post('/delete', verify, async (req, res) => {
  Article.deleteOne({_id: req.body.id}, (err, res) => {
    if (err) return console.log(err);
    console.log(res);
  });
  res.redirect('/');
});

router.post('/edit', verify, async (req, res) => {
  await Article.findOne({_id: req.body.id}, (err, response) => {
    if (err) return console.log(err);
    return res.render(
      'editpost',
      { 
        articleId: response._id,
        articleTitle: response.head,
        articleText: response.text,
        articleTheme: response.theme
      })
  })
})

router.post('/save', verify, async (req, res) => {
  const articleId = req.body.id
  await Article.findOneAndUpdate(
    {_id: articleId},
    { $set: 
      {
        head: req.body.postHead,
        text: req.body.postText,
        theme: req.body.theme
      }
    },
    (err, result) => {
      if(err) console.log(err);
      return console.log(result);
    })
    res.redirect('/')
})

// User page
router.get('/reg', (req, res) => {
  res.render('reg', {pageTitle: "Регистрация пользователя"});
});

router.post('/reg', async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  })
  const savedUser = await user.save();
  res.redirect('/login');
});

router.get('/login', (req, res) => {
  res.render('login')
});

router.post('/login', async (req, res) => {
  const email = req.body.email
  const password = req.body.password
  await User.findOne({email: email}, (err, response) => {
    if (err) return console.log(err);
    console.log(response)
    if (response === null) {
      return res.send(`Такой пользователь не существует`)
    } else if (password !== response.password) {
        return res.send(`Неверно введен пароль`)
    } else if (email === response.email && password === response.password) {
      const token = jwt.sign({_id: response._id}, config.secret, {algorithm: "HS256"}, (err, token) => {
        if (err) return console.log(err);
        res.cookie('token', token, { expires: new Date(Date.now() + 604800) }).redirect('/')
      })
    }
  })
});

router.get('/logout', (req, res) => {
  res.clearCookie('token', {expires: 0})
  res.redirect('/')
});

module.exports = router;
