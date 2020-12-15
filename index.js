const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require('cookie-parser');
const { db, PORT } = require("./config/config");
const router = require('./routes/routes');

const port = process.env.PORT || PORT;

app.set('view engine', 'pug');
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: false }));
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