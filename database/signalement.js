var db = require('./pgpool.js');


module.exports = {
    insertSignalement: async function (id_message, id_sender, id_receiver, content, type) {
        const pool = db.getPool();
        return await pool.query('INSERT INTO "Signalement" ("id_message", "id_sender", "id_receiver", "content", "type") VALUES ($1, $2, $3, $4, $5)', [id_message, id_sender, id_receiver, content, type]);
    },
    getSignalement: async function (id_message) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Signalement" WHERE id_message = $1', [id_message]);
        if (results.rows.length > 0) {
            return results.rows[0];
        }
        return null;
    },


    insertSignalementWanted: async function (id_message, id_message_wanted, id_channel) {
        const pool = db.getPool();
        return await pool.query('INSERT INTO "SignalementWanted" ("id_message", "id_message_wanted", "id_channel") VALUES ($1, $2, $3)', [id_message, id_message_wanted, id_channel]);
    },
    getSignalementWanted: async function (id_message) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "SignalementWanted" WHERE id_message = $1', [id_message]);
        if (results.rows.length > 0) {
            return results.rows[0];
        }
        return null;
    },
    getSignalementWantedByMessage: async function (id_message_wanted) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "SignalementWanted" WHERE id_message_wanted = $1', [id_message_wanted]);
        if (results.rows.length > 0) {
            return results.rows[0];
        }
        return null;
    },


    insertSignalementBottle: async function (id_message, id_bottle) {
        const pool = db.getPool();
        return await pool.query('INSERT INTO "SignalementBottle" ("id_message", "id_bottle") VALUES ($1, $2)', [id_message, id_bottle]);
    },
    getSignalementBottle : async function (id_message) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "SignalementBottle" WHERE id_message = $1', [id_message]);
        if (results.rows.length > 0) {
            return results.rows[0];
        }
        return null;
    },
    getSignalementBottleByChannel: async function (id_bottle) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "SignalementBottle" WHERE id_bottle = $1', [id_bottle]);
        if (results.rows.length > 0) {
            return results.rows[0];
        }
        return null;
    },


    insertSignalementTicket: async function (id_message, id_channel) {
        const pool = db.getPool();
        return await pool.query('INSERT INTO "SignalementTicket" ("id_message", "id_channel") VALUES ($1, $2)', [id_message, id_channel]);
    },
    getSignalementTicket: async function (id_message) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "SignalementTicket" WHERE id_message = $1', [id_message]);
        if (results.rows.length > 0) {
            return results.rows[0];
        }
        return null;
    },
    getSignalementTicketByChannel: async function (id_channel) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "SignalementTicket" WHERE id_channel = $1', [id_channel]);
        if (results.rows.length > 0) {
            return results.rows[0];
        }
        return null;
    },


    insertSignalementSuggestion: async function (id_message, id_message_suggestion, id_channel) {
        const pool = db.getPool();
        return await pool.query('INSERT INTO "SignalementSuggestion" ("id_message", "id_message_suggestion", "id_channel") VALUES ($1, $2, $3)', [id_message, id_message_suggestion, id_channel]);
    },
    getSignalementSuggestion: async function (id_message) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "SignalementSuggestion" WHERE id_message = $1', [id_message]);
        if (results.rows.length > 0) {
            return results.rows[0];
        }
        return null;
    },
    getSignalementSuggestionByMessage: async function (id_message_suggestion) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "SignalementSuggestion" WHERE id_message_suggestion = $1', [id_message_suggestion]);
        if (results.rows.length > 0) {
            return results.rows[0];
        }
        return null;
    },


    insertSignalementHelp: async function (id_message, id_message_help, id_channel) {
        const pool = db.getPool();
        return await pool.query('INSERT INTO "SignalementHelp" ("id_message", "id_message_help", "id_channel") VALUES ($1, $2, $3)', [id_message, id_message_help, id_channel]);
    },
    getSignalementHelp: async function (id_message) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "SignalementHelp" WHERE id_message = $1', [id_message]);
        if (results.rows.length > 0) {
            return results.rows[0];
        }
        return null;
    },
    getSignalementHelpByMessage: async function (id_message_help) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "SignalementHelp" WHERE id_message_help = $1', [id_message_help]);
        if (results.rows.length > 0) {
            return results.rows[0];
        }
        return null;
    },


    insertSignalementBird: async function (id_message, id_channel) {
        const pool = db.getPool();
        return await pool.query('INSERT INTO "SignalementBird" ("id_message", "id_channel") VALUES ($1, $2)', [id_message, id_channel]);
    },
    getSignalementBird: async function (id_message) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "SignalementBird" WHERE id_message = $1', [id_message]);
        if (results.rows.length > 0) {
            return results.rows[0];
        }
        return null;
    },
    getSignalementBirdByChannel: async function (id_channel) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "SignalementBird" WHERE id_channel = $1', [id_channel]);
        if (results.rows.length > 0) {
            return results.rows[0];
        }
        return null;
    },



    insertSignalementIleMessage: async function (id_message, id_message_ile, id_channel) {
        const pool = db.getPool();
        return await pool.query('INSERT INTO "SignalementIleMessage" ("id_message", "id_message_ile", "id_channel") VALUES ($1, $2, $3)', [id_message, id_message_ile, id_channel]);
    },
    getSignalementIleMessage: async function (id_message) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "SignalementIleMessage" WHERE id_message = $1', [id_message]);
        if (results.rows.length > 0) {
            return results.rows[0];
        }
        return null;
    },
    getSignalementIleMessageByMessage: async function (id_message_ile) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "SignalementIleMessage" WHERE id_message_ile = $1', [id_message_ile]);
        if (results.rows.length > 0) {
            return results.rows[0];
        }
        return null;
    },


    deleteSignalement: async function (id_message) {
        const pool = db.getPool();
        return await pool.query('DELETE FROM "Signalement" WHERE id_message = $1', [id_message]);
    }
};