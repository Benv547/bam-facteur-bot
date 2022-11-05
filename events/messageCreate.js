const orAction = require("../utils/orAction");
const createEmbeds = require("../utils/createEmbeds");

const OR_VOTE = 50;
const OR_BUMP = 150;

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
                    const embed = createEmbeds.createFullEmbed(`Merci pour ton vote !`, user.toString()  + ', vous avez reçu **' + OR_VOTE + ' pièce(s) d\'or**', null, null, null, null);
                    return await message.channel.send({ content: '', embeds: [embed], ephemeral: true });
                }
            }
        }

        if (message.interaction) {
            await new Promise(r => setTimeout(r, 500));
            if (message.embeds.length > 0) {
                console.log(message.embeds[0].description);
                const content = message.embeds[0].description;
                if (content) {
                    const user = message.interaction.user;
                    if (content.includes('a Voté pour')) {
                        await orAction.increment(user.id, OR_VOTE);
                        const embed = createEmbeds.createFullEmbed(`Merci pour ton vote !`, user.toString()  + ', vous avez reçu **' + OR_VOTE + ' pièce(s) d\'or**', null, null, null, null);
                        await message.channel.send({content: "", embeds: [embed]});
                    } else if (content.includes('Bump effectué !') || content.includes('a BUMP')) {
                        await orAction.increment(user.id, OR_BUMP);
                        const embed = createEmbeds.createFullEmbed(`Merci pour ton bump !`, user.toString()  + ', vous avez reçu **' + OR_BUMP + ' pièce(s) d\'or**', null, null, null, null);
                        await message.channel.send({content: "", embeds: [embed]});
                    }
                }
            }
        }
    },
};