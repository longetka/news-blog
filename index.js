const express = require("express");
const mongoose = require("mongoose");
const passport = require('passport');
const path = require("path");
const { db, PORT } = require("./config/config")
const router = require('./routes/routes');

const port = process.env.PORT || PORT;
const app = express();

app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));
app.use(router);

(async function startApp() {
  await mongoose.connect(
    db,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (error) => {
      if (error) return console.error(error);
      console.log("[DATABASE] DB connection success")
    });
  await app.listen(port, ()=> {
    console.log("[SERVER] Server listen on http://localhost:%s", port);
  })
})();