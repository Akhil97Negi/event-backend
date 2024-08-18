const express = require('express');
const {
  createEvent,
  updateEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
} = require('../controllers/eventController');
const Auth = require('../middleware/authmiddleware');

const eventRouter = express.Router();


eventRouter.post('/',  createEvent);

// Update an event (Admin only)
eventRouter.put('/:id', Auth(['admin']), updateEvent);

// Delete an event (Admin only)
eventRouter.delete('/:id', Auth(['admin']), deleteEvent);

// Get all events (Public access)
eventRouter.get('/', getAllEvents);

// Get an event by ID (Public access)
eventRouter.get('/:id', getEventById);

module.exports = eventRouter;
