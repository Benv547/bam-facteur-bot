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
            let regex = /Le joueur \*\*(.*)\*\* vient de voter pour le serveur./g;
            let match = regex.exec(content);
            if (!match) {
                regex = /(.*) vient de voter pour le serveur !/g;
                match = regex.exec(content);
            }
            if (match) {
                const user = message.guild.members.cache.find(m => m.user.username === match[1]);
                if (user) {
                    await orAction.increment(user.id, OR_VOTE);
                    await xpAction.increment(message.guild, user.id, XP_VOTE);
                    const embed = createEmbeds.createFullEmbed(`Merci pour votre vote !`, user.toString()  + ', vous avez reçu **' + OR_VOTE + ' <:piece:1045638309235404860>** et de l\'<:xp:851123277497237544>.', null, null, null, null);
                    return await message.channel.send({ content: '', embeds: [embed], ephemeral: true });
                }
            }
        }
    },
};