const Event = require('../models/eventModel');
const Participant = require('../models/participantModel');

// Create a new event
// const createEvent = async (req, res) => {
//   try {
//     const event = new Event(req.body);
//     await event.save();
//     res.status(201).json(event);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
const createEvent = async (req, res) => {
  try {
    const { name, date, time, location, description, participantLimit } = req.body;

    // Validate input
    if (!name || !date || !time || !location || !description) {
      return res.status(400).json({ message: 'All fields except participantLimit are required' });
    }

    // Create new event
    const event = new Event({
      name,
      date,
      time,
      location,
      description,
      participantLimit: participantLimit || 0, // Default to 0 if not provided
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Update an event
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an event
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Remove all participants associated with the event
    await Participant.deleteMany({ event: req.params.id });

    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all events
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get an event by ID
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEvent,
  updateEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
};
