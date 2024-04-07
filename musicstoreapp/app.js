let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');


let app = express();

let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


let expressSession = require('express-session');
app.use(expressSession({
  secret: 'abcdefg',
  resave: true,
  saveUninitialized: true
}));

let crypto = require('crypto');
app.set('clave','abcdefg');
app.set('crypto',crypto);
let fileUpload = require('express-fileupload');
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
  createParentPath: true
}));
app.set('uploadPath', __dirname)



const { MongoClient } = require("mongodb");
const connectionStrings = 'mongodb+srv://admin:sdi@musicstoreapp.dab4kse.mongodb.net/?retryWrites=true&w=majority&appName=musicstoreapp';
const dbClient = new MongoClient(connectionStrings);

const userSessionRouter = require('./routes/userSessionRouter.js');
const userAudiosRouter = require('./routes/userAudiosRouter');
const favoriteSongsRouter = require('./routes/songs/favorites');
app.use("/songs/add",userSessionRouter);
app.use("/publications",userSessionRouter);
app.use("/songs/buy",userSessionRouter);
app.use("/purchases",userSessionRouter);
app.use("/audios/",userAudiosRouter);
app.use("/shop/",userSessionRouter);


// para que solo el autor de la canción pueda modificar y/o eliminar sus canciones
const userAuthorRouter = require('./routes/userAuthorRouter');
app.use("/songs/edit",userAuthorRouter);
app.use("/songs/delete",userAuthorRouter);


// solamente los usuarios autenticados puedan gestionar favoritos.
app.use("/songs/favorites", userSessionRouter);
app.use("/songs/favorites/add/:song_id", userSessionRouter);
app.use("/songs/favorites/delete/:song_id", userSessionRouter);


// songs repository
let songsRepository = require("./repositories/songsRepository.js");
songsRepository.init(app, dbClient);

// users repository
const usersRepository = require("./repositories/usersRepository.js");
usersRepository.init(app, dbClient);
require("./routes/users.js")(app, usersRepository);

// favorites repository
const favoriteSongsRepository = require("./repositories/favoriteSongsRepository.js");
favoriteSongsRepository.init(app, dbClient);
require("./routes/songs/favorites.js")(app, favoriteSongsRepository, songsRepository);


let indexRouter = require('./routes/index');
require("./routes/songs.js")(app, songsRepository);
require("./routes/authors.js")(app);
require("./routes/api/songsAPIv1.0.js")(app, songsRepository);



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log("Se ha producido un error " + err);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.log("Error: " + err);
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
