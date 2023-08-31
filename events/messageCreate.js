const orAction = require("../utils/orAction");
const createEmbeds = require("../utils/createEmbeds");
const xpAction = require("../utils/xpAction");

const OR_VOTE = 20;
const OR_BUMP = 150;
const XP_VOTE = 10;
const XP_BUMP = 50;

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        // if message is a webhook message, return
        if (message.webhookId) {
            const content = message.content;
            let regex = /The player \*\*(.*)\*\* just voted for the server./g;
            let match = regex.exec(content);
            if (!match) {
                regex = /(.*) just voted for the server!/g;
                match = regex.exec(content);
            }
            if (match) {
                const user = message.guild.members.cache.find(m => m.user.username === match[1]);
                if (user) {
                    await orAction.increment(user.id, OR_VOTE);
                    await xpAction.increment(message.guild, user.id, XP_VOTE);
                    const embed = createEmbeds.createFullEmbed(`Thank you for your vote!`, user.toString()  + ', you have received **' + OR_VOTE + ' <:gold:1058066245154525265>** and some <:xp:1058066266797113455>.', null, null, null, null);
                    return await message.channel.send({ content: '', embeds: [embed], ephemeral: true });
                }
            }
        }
    },
};