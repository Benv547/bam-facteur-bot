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
                    const embed = createEmbeds.createFullEmbed(`Merci pour votre vote !`, user.toString()  + ', vous avez reçu **' + OR_VOTE + ' pièce(s) d\'or** et de l\'expérience.', null, null, null, null);
                    return await message.channel.send({ content: '', embeds: [embed], ephemeral: true });
                }
            }
        }

        if (message.interaction) {
            if (message.embeds.length > 0) {
                const content = message.embeds[0].description;
                if (content) {
                    const user = message.interaction.user;
                    if (content.includes('Bump effectué !')) {
                        await orAction.increment(user.id, OR_BUMP);
                        await xpAction.increment(message.guild, user.id, XP_BUMP);
                        const embed = createEmbeds.createFullEmbed(`Merci pour votre bump !`, user.toString()  + ', vous avez reçu **' + OR_BUMP + ' pièce(s) d\'or** et de l\'expérience.', null, null, null, null);
                        await message.channel.send({content: "", embeds: [embed]});
                    }
                }
            }
        }
    },
};