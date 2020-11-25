const { Router } = require("express");
const router = Router();
const Article = require('../model/article');
const User = require('../model/user');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Main page
router.get('/', async (req, res) => {
  const post = await Article.find({});
  res.render('main', { pageTitle: "My Blog", post})
});

router.get('/theme/:theme', async (req, res) => {
  const post = await Article.find({theme: req.params.theme});
  res.render('main', { pageTitle: req.params.theme, post });
});

// Articles page
router.get('/addpost', (req, res) => {
  res.render('addpost', { pageTitle: "Добавление поста" })
});

router.post('/create', async (req, res) => {
  const model = new Article({
    head: req.body.postHead,
    text: req.body.postText,
    theme: req.body.theme
  });

  await model.save();
  res.redirect('/')
});

router.post('/delete', async (req, res) => {
  Article.deleteOne({_id: req.body.id}, (err, res) => {
    if (err) return console.log(err);
    console.log(res);
  });
  res.redirect('/');
});

router.post('/edit', async (req, res) => {
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

router.post('/save', async (req, res) => {
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
// router.get('/reg', (req, res) => {
//   res.render('reg', {pageTitle: "Регистрация пользователя"});
// });

router.post('/reg', async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  })

  const savedUser = await user.save();
  res.send(savedUser);
});

// router.get('/login', (req, res) => {
//   const email = req.body.email;
//   const password = req.body.password;

//   User.getUserByEmail(login, (err, user) => {
//     if (err) throw err;
//     if (!user)  
//       return res.json({success: false, msg: "Такой пользователь не был найден"});
    
//       User.comparePass(password, user.password, (err, isMatch) => {
//         if (err) throw err;
//         if (isMatch) {
//           const token = jwt.sign(user, config.secret, {
//             expiresIn: 3600 * 24
//           });

//           res.json({
//             success: true,
//             token: 'JWT ' + token,
//             user: {
//               id: user._id,
//               name: user.username,
//               email: user.email
//             }
//           })
//         } else {
//           return res.json({success: false, msg: "Пароли не совпадают"})
//         }
//       });
//   });
// })

module.exports = router;