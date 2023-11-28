// Create web server

// Get the packages we need
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Comment = require('./models/comment');
var User = require('./models/user');
var jwt = require('jwt-simple');
var passport = require('passport');
var config = require('./config/db');
var authController = require('./controllers/auth');
var userController = require('./controllers/user');
var commentController = require('./controllers/comment');
var app = express();

// Use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Use passport package in our application
app.use(passport.initialize());

// Connect to database
mongoose.connect(config.database);

// Pass passport for configuration
require('./config/passport')(passport);

// Create our Express router
var router = express.Router();

// Create endpoint handlers for /users
router.route('/users')
	.post(authController.isAuthenticated, userController.postUsers)
	.get(authController.isAuthenticated, userController.getUsers);

// Create endpoint handlers for /users/:user_id
router.route('/users/:user_id')
	.get(authController.isAuthenticated, userController.getUser)
	.put(authController.isAuthenticated, userController.putUser)
	.delete(authController.isAuthenticated, userController.deleteUser);

// Create endpoint handlers for /comments
router.route('/comments')
	.post(authController.isAuthenticated, commentController.postComments)
	.get(authController.isAuthenticated, commentController.getComments);

// Create endpoint handlers for /comments/:comment_id
router.route('/comments/:comment_id')
	.get(authController.isAuthenticated, commentController.getComment)
	.put(authController.isAuthenticated, commentController.putComment)
	.delete(authController.isAuthenticated, commentController.deleteComment);

// Register all our routes with /api
app.use('/api', router);

// Start the server
app.listen(3000);