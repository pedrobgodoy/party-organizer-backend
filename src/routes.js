const { Router } = require('express');

const routes = Router();

const AuthMiddleware = require('./middlewares/AuthMiddleware.js');
const AdmMiddleware = require('./middlewares/AdmMiddleware.js');

const EventCotroller = require('./controllers/EventController.js');
const UserController = require('./controllers/UserController.js');
const UsersController = require('./controllers/UsersController.js');
const AuthController = require('./controllers/AuthController.js');
const AdmController = require('./controllers/AdmController.js');

routes.get('/', (req, res) => {
    res.send("There is nothing here. Go Away!");
})

routes.get('/login', AuthController.login);
routes.post('/register', AuthController.register);

// All the routes below will need a valid jwt token
routes.use(AuthMiddleware);

routes.post('/evento', EventCotroller.store);
routes.get('/evento', EventCotroller.index);
routes.put('/evento', EventCotroller.update);
routes.delete('/evento', EventCotroller.delete);

routes.get('/user/:id', UserController.index);
routes.get('/user', UserController.index);

routes.put('/user', UserController.update);
routes.delete('/user', UserController.delete);

routes.put('/adm/:id', AdmController.update);

// All the routes below, the user will need to have adm rights

routes.get('/users', AdmMiddleware,  UsersController.index);

module.exports = routes;