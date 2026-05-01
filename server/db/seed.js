const bcrypt = require('bcrypt');
const pool = require('./pool');

const SALT_ROUNDS = 6;

const seed = async () => {
  await pool.query('DROP TABLE IF EXISTS rsvps');
  await pool.query('DROP TABLE IF EXISTS events');
  await pool.query('DROP TABLE IF EXISTS users');

  await pool.query(`
    CREATE TABLE users (
      user_id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE events (
      event_id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      date TEXT NOT NULL,
      location TEXT NOT NULL,
      event_type TEXT NOT NULL,
      max_capacity INTEGER NOT NULL,
      user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE
    )
  `);

  await pool.query(`
    CREATE TABLE rsvps (
      rsvp_id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
      event_id INTEGER REFERENCES events(event_id) ON DELETE CASCADE,
      UNIQUE (user_id, event_id)
    )
  `);

    const bryanHash = await bcrypt.hash('Password123', SALT_ROUNDS);
    const joseHash = await bcrypt.hash('Password456', SALT_ROUNDS);
    const felixHash = await bcrypt.hash('Password789', SALT_ROUNDS);

    const insertUserSql = `
    INSERT INTO users (username, password_hash) 
    VALUES ($1, $2)
    RETURNING user_id;
    `;

    const bryanResponse = await pool.query(insertUserSql, ['bryan', bryanHash]);
    const joseResponse = await pool.query(insertUserSql, ['jose', joseHash]);
    const felixResponse = await pool.query(insertUserSql, ['felix', felixHash]);
    
    const bryanId = bryanResponse.rows[0].user_id;
    const joseId = joseResponse.rows[0].user_id;
    const felixId = felixResponse.rows[0].user_id;

    const eventQuery = `
    INSERT INTO events (user_id, title, description, date, location, event_type, max_capacity)
    VALUES ($1, $2, $3, $4, $5, $6, $7)`;
    const event1Response = await pool.query(eventQuery + ' RETURNING event_id', [bryanId, 'Startup Pitch Night', 'Founders welcomed to pitch their startup ideas', '04-28-2026', 'Upper East Side, New York', 'networking', 98]);
    const event2Response = await pool.query(eventQuery + ' RETURNING event_id', [joseId, 'Jazz Night', 'Come in your best attire for a night of jazz!', '05-01-2026', 'West Village', 'entertainment', 25]);
    const event3Response = await pool.query(eventQuery + ' RETURNING event_id', [felixId, 'Movie Night', 'No popcorn? No problem! Snacks provided!', '05-13-2026', 'My house', 'entertainment', 10]);

    const event1Id = event1Response.rows[0].event_id;
    const event2Id = event2Response.rows[0].event_id;
    const event3Id = event3Response.rows[0].event_id;

    const rsvpQuery = `
    INSERT INTO rsvps (user_id, event_id)
    VALUES ($1, $2)`;
    await pool.query(rsvpQuery, [joseId, event1Id]);
    await pool.query(rsvpQuery, [felixId, event1Id]);
    await pool.query(rsvpQuery, [bryanId, event2Id]);
    await pool.query(rsvpQuery, [felixId, event2Id]);
    await pool.query(rsvpQuery, [bryanId, event3Id]);
    await pool.query(rsvpQuery, [joseId, event3Id]);
    
    pool.end();
};

seed().catch((err) => {
    console.error('Seeding failed:', err);
    pool.end();
});
