const fs = require('fs');
const path = require('path');
const event = require('../models/event'); // Import the event model

// Path to the JSON cache file
const cacheDirPath = path.join(__dirname, '../../frontend/cache');
const cacheFilePath = path.join(cacheDirPath, 'events.json');

// Function to save events to JSON file
const saveEventsToCache = async () => {
    try {
        // Check if the cache directory exists, if not, create it
        if (!fs.existsSync(cacheDirPath)) {
            fs.mkdirSync(cacheDirPath, { recursive: true });
        }

        const events = await event.showAllEvents(); // Get all events from the database
         fs.writeFileSync(cacheFilePath, JSON.stringify(events, null, 2), 'utf-8');
        return events;
    } catch (error) {
        console.error('Error saving events to cache:', error);
        throw error;
    }
};

// Create event
const createEvent = async (req, res) => {
    const { name, type, mode, frequency, dmrChannel, date, entity, description } = req.body;
    try {
        if (req.session && req.session.userId) {
           
        
        await event.addEvent({ name, type, mode, frequency, dmrChannel, date, entity, description });
        await saveEventsToCache(); // Update the cache after creating a new event
        res.status(201).json({ message: 'Event created successfully' });
    }
    else
    {
        return res.status(401).json({ message: 'User not logged in' });
    }
    } catch (error) {
        res.status(500).json({ message: 'Error creating event', error });
    }
};

// Get all events from cache or regenerate if missing
const getAllEvents = async (req, res) => {
    try {
        let events;
        if (fs.existsSync(cacheFilePath)) {
            // Read events from the cache file if it exists
            events = JSON.parse(fs.readFileSync(cacheFilePath, 'utf-8'));
        } else {
            // Regenerate the cache file by fetching from the database
            events = await saveEventsToCache();
        }
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events', error });
    }
};

const deleteEvent = async (req, res) => {
     const { id } = req.body;;
    try {
        if (req.session && req.session.userId) {
        

        // Attempt to delete the event from the database
        const result = await event.deleteEventById(id); // Assuming deleteEventById is a method in your event model
        if (result) {
            await saveEventsToCache(); // Update the cache after deleting an event
            res.status(200).json({ message: 'Event deleted successfully' });
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    }
    else {
        res.status(401).json({ message: 'User not logged in' });
    }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting event', error });
    }
};

// Other functions remain the same...

module.exports = { createEvent, getAllEvents, deleteEvent };
