
const express = require('express');
const { createEvent, getAllEvents, deleteEvent } = require('../controllers/eventController');
const { userRegister, userLogin, userLogout,userIsLogedin } = require('../controllers/userController');

const router = express.Router();

// Rotas de usuário
router.post('/register', userRegister);  // Rota para registrar usuário
router.post('/login', userLogin);        // Rota para login
router.post('/logout',  userLogout); // Rota para logout (proteção com middleware)
router.get('/isLoggedIn', userIsLogedin);

// Rotas de eventos
router.post('/events', createEvent);     // Rota para criar eventos
router.get('/events', getAllEvents);     // Rota para listar todos os eventos
router.delete('/events', deleteEvent); // Rota para listar eventos por ID

module.exports = router;