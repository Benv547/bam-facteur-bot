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
    giveAchievementToUser: async function (id_user, id_achievement) {
        const pool = getPool();
        return await pool.query('INSERT INTO "User_Achievement" ("id_user", "id_achievement") VALUES ($1, $2)', [id_user, id_achievement]);
    },
    getAllAchievementsFromUser: async function (id_user) {
        const pool = getPool();
        const results = await pool.query('SELECT * FROM "User_Achievement" WHERE "id_user" = $1', [id_user]);
        if (results.rows.length === 0) {
            return null;
        }
        return results.rows;
    },
    getAllAchievements: async function () {
        const pool = getPool();
        const results = await pool.query('SELECT * FROM "Achievement"');
        if (results.rows.length === 0) {
            return null;
        }
        return results.rows;
    },


    // SQL queries for the achievements
    // List all users who have sent more than "value" bottle and don't have the achievement
    achievementXBottlesSent: async function (id_achievement, value) {
        const pool = getPool();
        const results = await pool.query('SELECT id_user FROM "User" WHERE "id_user" NOT IN (SELECT "id_user" FROM "User_Achievement" WHERE "id_achievement" = $1) AND "id_user" IN (SELECT "id_user_author" FROM "Bottle" GROUP BY "id_user_author" HAVING COUNT(*) >= $2)', [id_achievement, value]);
        if (results.rows.length === 0) {
            return null;
        }
        return results.rows;
    },
    // List all users who have received more than "value" bottle and don't have the achievement
    achievementXBottlesReceived: async function (id_achievement, value) {
        const pool = getPool();
        const results = await pool.query('SELECT id_user FROM "User" WHERE "id_user" NOT IN (SELECT "id_user" FROM "User_Achievement" WHERE "id_achievement" = $1) AND "id_user" IN (SELECT "id_user_recipient" FROM "Bottle" GROUP BY "id_user_recipient" HAVING COUNT(*) >= $2)', [id_achievement, value]);
        if (results.rows.length === 0) {
            return null;
        }
        return results.rows;
    },
    // List all users who have sent more than "value" messages and don't have the achievement
    achievementXMessagesSent: async function (id_achievement, value) {
        const pool = getPool();
        const results = await pool.query('SELECT id_user FROM "User" WHERE "id_user" NOT IN (SELECT "id_user" FROM "User_Achievement" WHERE "id_achievement" = $1) AND "id_user" IN (SELECT "id_user" FROM "Message" GROUP BY "id_user" HAVING COUNT(*) >= $2)', [id_achievement, value]);
        if (results.rows.length === 0) {
            return null;
        }
        return results.rows;
    },
    // List all users who have sent a message legth > "value" and don't have the achievement
    achievementXMessageLength: async function (id_achievement, value) {
        const pool = getPool();
        const results = await pool.query('SELECT id_user FROM "User" WHERE "id_user" NOT IN (SELECT "id_user" FROM "User_Achievement" WHERE "id_achievement" = $1) AND "id_user" IN (SELECT "id_user" FROM "Message" WHERE LENGTH("content") >= $2)', [id_achievement, value]);
        if (results.rows.length === 0) {
            return null;
        }
        return results.rows;
    },
    // List all users who have sent a message that contains "value" and don't have the achievement
    achievementXMessageContains: async function (id_achievement, value) {
        const pool = getPool();
        const results = await pool.query('SELECT id_user FROM "User" WHERE "id_user" NOT IN (SELECT "id_user" FROM "User_Achievement" WHERE "id_achievement" = $1) AND "id_user" IN (SELECT "id_user" FROM "Message" WHERE "content" LIKE $2)', [id_achievement, `%${value}%`]);
        if (results.rows.length === 0) {
            return null;
        }
        return results.rows;
    },
    // List all users who have invited more than "value" users and don't have the achievement
    achievementXUsersInvited: async function (id_achievement, value) {
        const pool = getPool();
        const results = await pool.query('SELECT id_user FROM "User" WHERE "id_user" NOT IN (SELECT "id_user" FROM "User_Achievement" WHERE "id_achievement" = $1) AND "id_user" IN (SELECT "id_user_inviter" FROM "Invite" WHERE "id_user_invited" IS NOT NULL GROUP BY "id_user_inviter" HAVING COUNT(*) >= $2)', [id_achievement, value]);
        if (results.rows.length === 0) {
            return null;
        }
        return results.rows;
    },
    // List all users who have send more than "value" suggestions and don't have the achievement
    achievementXSuggestionsSent: async function (id_achievement, value) {
        const pool = getPool();
        const results = await pool.query('SELECT id_user FROM "User" WHERE "id_user" NOT IN (SELECT "id_user" FROM "User_Achievement" WHERE "id_achievement" = $1) AND "id_user" IN (SELECT "id_user" FROM "Suggestion" WHERE "isReply" = false GROUP BY "id_user" HAVING COUNT(*) >= $2)', [id_achievement, value]);
        if (results.rows.length === 0) {
            return null;
        }
        return results.rows;
    },
    // List all users who have send more than "value" opinion and don't have the achievement
    achievementXOpinionsSent: async function (id_achievement, value) {
        const pool = getPool();
        const results = await pool.query('SELECT id_user FROM "User" WHERE "id_user" NOT IN (SELECT "id_user" FROM "User_Achievement" WHERE "id_achievement" = $1) AND "id_user" IN (SELECT "id_user" FROM "Opinion" GROUP BY "id_user" HAVING COUNT(*) >= $2)', [id_achievement, value]);
        if (results.rows.length === 0) {
            return null;
        }
        return results.rows;
    },
    // List all users who have more than "value" nb_treasures and don't have the achievement
    achievementXNbTreasures: async function (id_achievement, value) {
        const pool = getPool();
        const results = await pool.query('SELECT id_user FROM "User" WHERE "id_user" NOT IN (SELECT "id_user" FROM "User_Achievement" WHERE "id_achievement" = $1) AND "nb_treasures" >= $2', [id_achievement, value]);
        if (results.rows.length === 0) {
            return null;
        }
        return results.rows;
    },
    // List all users who have more than "value" money_spent and don't have the achievement
    achievementXMoneySpent: async function (id_achievement, value) {
        const pool = getPool();
        const results = await pool.query('SELECT id_user FROM "User" WHERE "id_user" NOT IN (SELECT "id_user" FROM "User_Achievement" WHERE "id_achievement" = $1) AND "money_spent" >= $2', [id_achievement, value]);
        if (results.rows.length === 0) {
            return null;
        }
        return results.rows;
    },
    // List all users who have more than "value money and don't have the achievement
    achievementXMoney: async function (id_achievement, value) {
        const pool = getPool();
        const results = await pool.query('SELECT id_user FROM "User" WHERE "id_user" NOT IN (SELECT "id_user" FROM "User_Achievement" WHERE "id_achievement" = $1) AND "money" >= $2', [id_achievement, value]);
        if (results.rows.length === 0) {
            return null;
        }
        return results.rows;
    },
    // List all users who have invited more than "value" VIP users and don't have the achievement
    achievementXVIPUsersInvited: async function (id_achievement, value) {
        const pool = getPool();
        const results = await pool.query('SELECT id_user FROM "User" WHERE "id_user" NOT IN (SELECT "id_user" FROM "User_Achievement" WHERE "id_achievement" = $1) AND "id_user" IN (SELECT "id_user_inviter" FROM "Invite" WHERE "id_user_invited" IS NOT NULL AND "id_user_invited" IN (SELECT "id_user" FROM "User" WHERE "isVIP" = true) GROUP BY "id_user_inviter" HAVING COUNT(*) >= $2)', [id_achievement, value]);
        if (results.rows.length === 0) {
            return null;
        }
        return results.rows;
    }
};