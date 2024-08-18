const express = require('express');
const { registerForEvent, cancelRegistration } = require('../controllers/participantController');
const Auth = require('../middleware/authmiddleware');

const participantRouter = express.Router();

// Register for an event
participantRouter.post('/register/:eventId', Auth(['user']), registerForEvent);

// Cancel registration
participantRouter.delete('/cancel/:eventId', Auth(['user']), cancelRegistration);

module.exports = participantRouter;
