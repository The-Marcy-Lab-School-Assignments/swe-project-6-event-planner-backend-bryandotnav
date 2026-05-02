const eventModel = require('../models/eventModel');

// POST /api/events
const createEvent = async (req, res, next) => {
  try {
    const { title, description, date, location, event_type, max_capacity } =
      req.body;
    const user_id = req.session.user_id;
    if (!title || !description || !date || !location || !event_type || !max_capacity ) {
      return res.status(400).send({ message: "Missing required fields" });
    }
    const event = await eventModel.create(
      title,
      description,
      date,
      location,
      event_type,
      max_capacity,
      user_id
    );
    res.status(201).send(event);
  } catch (err) {
    next(err);
  }
};

// GET /api/events
const listEvents = async (req, res, next) => {
  try {
    const events = await eventModel.list();
    res.status(200).send(events);
  } catch (err) {
    next(err);
  }
};

// GET /api/users/:user_id/events
const listUserEvents = async (req, res, next) => {
  try {
    const userId = Number(req.params.user_id);
    const events = await eventModel.listByUser(userId);
    res.status(200).send(events);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/events/:event_id
const updateEvent = async (req, res, next) => {
  try {
    const eventId = Number(req.params.event_id);

    const e = await eventModel.find(eventId);
    if (!e) return res.status(404).send({ message: 'Event not found' });

    if (e.user_id !== req.session.user_id) {
      return res.status(403).send({ message: 'You can only update events made by you.' });
    }

    const { title, description, date, location, event_type, max_capacity } = req.body;
    const event = await eventModel.update(
      eventId,
      title,
      description,
      date,
      location,
      event_type,
      max_capacity
    );
    res.status(200).send(event);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/events/:event_id
const deleteEvent = async (req, res, next) => {
  try {
    const eventId = Number(req.params.event_id);
    const e = await eventModel.find(eventId);
    if (!e) return res.status(404).send({ message: "Event not found" });
    if (Number(e.user_id) !== Number(req.session.user_id)) {
      return res
        .status(403)
        .send({ message: "You can only delete events made by you." });
    }
    const event = await eventModel.destroy(eventId);
    res.send(event);
  } catch (err) {
    next(err);
  }
};

module.exports = {
    createEvent,
    listEvents,
    listUserEvents,
    updateEvent,
    deleteEvent,
};