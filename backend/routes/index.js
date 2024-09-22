
const express = require('express');
const { createEvent, getAllEvents } = require('../controllers/eventController');
const { userRegister, userLogin, userLogout } = require('../controllers/userController');

const router = express.Router();

// Rotas de usuário
router.post('/register', userRegister);  // Rota para registrar usuário
router.post('/login', userLogin);        // Rota para login
router.post('/logout',  userLogout); // Rota para logout (proteção com middleware)

// Rotas de eventos
router.post('/events', createEvent);     // Rota para criar eventos
router.get('/events', getAllEvents);     // Rota para listar todos os eventos

module.exports = router;