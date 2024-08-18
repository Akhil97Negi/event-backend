const Participant = require('../models/participantModel');
const Event = require('../models/eventModel');

// Register for an event
const registerForEvent = async (req, res) => {
    const userId = req.user.id;  // User ID is set by Auth middleware
    const eventId = req.params.eventId;

    try {
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        // Check if the user is already registered
        const existingParticipant = await Participant.findOne({ user: userId, event: eventId });
        if (existingParticipant) return res.status(400).json({ message: 'User already registered for this event' });

        // Check if there's space in the event
        if (event.participants.length >= event.participantLimit && event.participantLimit > 0) {
            await Participant.create({ user: userId, event: eventId, status: 'waitlisted' });
            event.waitlist.push(userId);
            await event.save();
            return res.status(200).json({ message: 'Added to waitlist' });
        }

        // Register the user for the event
        await Participant.create({ user: userId, event: eventId, status: 'registered' });
        event.participants.push(userId);
        await event.save();
        res.status(200).json({ message: 'Registration successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cancel registration
const cancelRegistration = async (req, res) => {
    const userId = req.user.id;  // User ID is set by Auth middleware
    const eventId = req.params.eventId;

    try {
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        // Check if the user is registered
        const participant = await Participant.findOne({ user: userId, event: eventId });
        if (!participant) return res.status(400).json({ message: 'User not registered for this event' });

        // Remove the user from participants
        await Participant.findOneAndDelete({ user: userId, event: eventId });
        event.participants = event.participants.filter(id => id.toString() !== userId.toString());

        // Move the first user from waitlist to participants
        if (event.waitlist.length > 0) {
            const nextUser = event.waitlist.shift();
            await Participant.create({ user: nextUser, event: eventId, status: 'registered' });
            event.participants.push(nextUser);
        }

        await event.save();
        res.status(200).json({ message: 'Registration canceled' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerForEvent, cancelRegistration };
