const pool = require('../db/pool');

module.exports.listByUser = async (user_id) => {
    const query = `SELECT events.event_id, 
          events.title, 
          events.description, 
          events.date, 
          events.location,
          events.event_type, 
          events.max_capacity, 
          events.user_id,
          users.username,
          COUNT(rsvps.rsvp_id) AS rsvp_count
          FROM events
          INNER JOIN rsvps ON events.event_id = rsvps.event_id 
          INNER JOIN users ON users.user_id = rsvps.user_id
          WHERE users.user_id = $1
          GROUP BY events.event_id, users.user_id
          ORDER BY rsvp_count DESC`;
    const { rows } = await pool.query(query, [user_id]);
    return rows;
};
  
module.exports.create = async (user_id, event_id) => {
    const query =
      `INSERT INTO rsvps (
            user_id, 
            event_id) 
        VALUES ($1, $2) ON CONFLICT DO NOTHING 
        RETURNING *
        `;
    const { rows } = await pool.query(query, [user_id, event_id]);
    return rows;
};
  
module.exports.destroy = async (user_id, event_id) => {
    const query = 'DELETE FROM rsvps WHERE user_id = $1 AND event_id = $2 RETURNING *';
    const { rows } = await pool.query(query, [user_id, event_id]);
    return rows;
};