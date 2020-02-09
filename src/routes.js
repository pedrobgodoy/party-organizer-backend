const { Router } = require('express');

const routes = Router();

const EventCotroller = require('./controllers/EventController.js');
const UserController = require('./controllers/UserController.js');
const UsersController = require('./controllers/UsersController.js');

routes.post('/evento', EventCotroller.store);
routes.get('/evento', EventCotroller.index);

routes.post('/user', UserController.store);
routes.get('/user', UserController.index);

routes.get('/users', UsersController.index);

module.exports = routes;