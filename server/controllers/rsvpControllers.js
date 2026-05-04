const rsvpModel = require('../models/rsvpModel');

// POST /api/events/:event_id/rsvps 
const createRsvp = async (req, res, next) => {
  try {
    const { user_id } = req.session;
    const event_id = Number(req.params.event_id);
    const rsvp = await rsvpModel.create(user_id, event_id);
    res.status(201).send(rsvp);
  } catch (err) {
    next(err);
  }
};

// GET /api/users/:user_id/rsvps
const listRsvps = async (req, res, next) => {
    try {
      const { user_id } = req.session;
      const rsvps = await rsvpModel.listByUser(user_id);
      res.status(200).send(rsvps);
    } catch (err) {
      next(err);
    }
};

// DELETE /api/events/:event_id/rsvps
const deleteRsvp = async (req, res, next) => {
  try {
    const { user_id } = req.session;
    const event_id = Number(req.params.event_id);
    const destroy = await rsvpModel.destroy(user_id, event_id);
    res.status(204).send(destroy);
  } catch (err) {
    next(err);
  }
};

module.exports = { 
    createRsvp, 
    listRsvps, 
    deleteRsvp 
};