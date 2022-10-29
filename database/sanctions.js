const { dbuser, dbhost, dbbase, dbpassword, dbport } = require('../db.json');

const Pool = require('pg').Pool
function getPool() {
    const pool = new Pool({
        user: dbuser,
        host: dbhost,
        database: dbbase,
        password: dbpassword,
        port: dbport
        // ssl: { rejectUnauthorized: false }
    })
    return pool;
}

module.exports = {
    saveSanction :async function (id_user, id_mod, gravity, content){
        const pool = getPool();
        return await pool.query('INSERT INTO "Sanctions" ("id_user", "id_mod", "gravity", "content") VALUES ($1, $2, $3, $4)', [id_user, id_mod, gravity, content]);
    },

    getOldWarn: async function (id_user) {
        const pool = getPool();
        const results = await pool.query('select * from "Sanctions" where "id_user" = $1 ORDER BY "date"', [id_user]);
        return results.rows;
    },

    countDetail: async function(id_user, gravity){
        const pool = getPool();
        const results = await pool.query('select count (*) from "Sanctions" where id_user = $1 AND gravity = $2', [id_user, gravity])
        return results.rows[0]["count"];
    },


    getSanctionCountForOneWeek: async function (gravity) {
        const pool = getPool();
        const results = await pool.query('SELECT COUNT(*) FROM "Sanctions" WHERE "date" > NOW() - INTERVAL \'7 days\' AND "gravity" = $1', [gravity]);
        return results.rows[0]["count"];
    },
    getSanctionCountEachDayForOneWeek: async function (gravity) {
        const pool = getPool();
        const results = await pool.query('SELECT COUNT(*) AS count, to_char(date, \'dd/MM\') AS time FROM "Sanctions" WHERE date > NOW() - INTERVAL \'7 days\' AND "gravity" = $1 GROUP BY time ORDER BY time ASC', [gravity]);
        return results.rows;
    },

    getSanctionCountForOneMonth: async function (gravity) {
        const pool = getPool();
        const results = await pool.query('SELECT COUNT(*) FROM "Sanctions" WHERE "date" > NOW() - INTERVAL \'30 days\' AND "gravity" = $1', [gravity]);
        return results.rows[0]["count"];
    },
    getSanctionCountEachDayForOneMonth: async function (gravity) {
        const pool = getPool();
        const results = await pool.query('SELECT COUNT(*) AS count, to_char(date, \'dd/MM\') AS time FROM "Sanctions" WHERE date > NOW() - INTERVAL \'30 days\' AND "gravity" = $1 GROUP BY time ORDER BY time ASC', [gravity]);
        return results.rows;
    },

    getSanctionCountForThisYear: async function (gravity) {
        const pool = getPool();
        const results = await pool.query('SELECT COUNT(*) FROM "Sanctions" WHERE EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM current_date) AND "gravity" = $1', [gravity]);
        return results.rows[0]["count"];
    },
    getSanctionCountEachMonthForThisYear: async function (gravity) {
        const pool = getPool();
        const results = await pool.query('SELECT COUNT(*) AS count, to_char(date, \'YYYY-MM\') AS time FROM "Sanctions" WHERE EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM current_date) AND "gravity" = $1 GROUP BY time ORDER BY time ASC', [gravity]);
        return results.rows;
    }
}