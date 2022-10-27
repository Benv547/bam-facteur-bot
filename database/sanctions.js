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
    }
}