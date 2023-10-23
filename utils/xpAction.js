const userDB = require("../database/user");
const { levels } = require('../xp.json');
const createEmbeds = require("./createEmbeds");

module.exports = {
    name: 'xpAction',
    async increment(guild, userId, qte) {
        const user = await userDB.getUser(userId);
        if (user) {
            const oldXp = user.xp;
            const newXp = oldXp + qte;

            await userDB.incr_xp(userId, qte);

            // temporary
            const channelID = '1166083338717642772';
            const channel = await guild.channels.fetch(channelID);
            await channel.send('Member ' + userId + ' win ' + qte + ' points');

            // end temporary

            // foreach levels
            let oldLevel;
            for (const level of levels) {
                if (newXp >= level.xp && oldXp < level.xp) {
                    // Fetch user from guild and setup role
                    const member = await guild.members.fetch(userId);
                    await member.roles.add(level.role);
                    // Fetch role from guild and send message.
                    const role = await guild.roles.fetch(level.role);
                    const embed = createEmbeds.createFullEmbed('Vous avez atteint un nouveau niveau !', 'Vous êtes maintenant **' + role.name + '** !', null, null, 0x2f3136, null);
                    try {
                        await member.send({ content: "", embeds: [embed] });
                    } catch {}
                    if (oldLevel) await member.roles.remove(oldLevel.role);
                }
                if (level.xp > newXp) break;
                oldLevel = level;
            }

            return true;
        }
        return false;
    },
    async getNextLevel(userId) {
        const user = await userDB.getUser(userId);
        if (user) {
            for (const level of levels) {
                if (user.xp < level.xp) {
                    return level.xp;
                }
            }
        }
        return 0;
    },
    async get(userId) {
        const user = await userDB.getUser(userId);
        if (user) {
            return user.xp;
        }
        return null;
    }
};