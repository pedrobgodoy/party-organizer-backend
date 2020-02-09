const { Router } = require('express');

const routes = Router();

const AuthMiddleware = require('./middlewares/AuthMiddleware.js');

const EventCotroller = require('./controllers/EventController.js');
const UserController = require('./controllers/UserController.js');
const UsersController = require('./controllers/UsersController.js');
const AuthController = require('./controllers/AuthController.js');

routes.get('/', (req, res) => {
    res.send("There is nothing here. Go Away!");
})

routes.get('/login', AuthController.login);
routes.post('/register', AuthController.register);

// All the routes below will need a valid jwt token
routes.use(AuthMiddleware);

routes.post('/evento', EventCotroller.store);
routes.get('/evento', EventCotroller.index);

routes.get('/user', UserController.index);

routes.get('/users', UsersController.index);

module.exports = routes;