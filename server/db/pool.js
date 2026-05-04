const { Pool } = require('pg');

const config = {
    host: 'localhost',
    port: 5432,
    database: 'event_planner_db',
    password: '042703',
};

const pool = new Pool(config);

module.exports = pool;