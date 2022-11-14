const orAction = require("../utils/orAction");
const xpAction = require("../utils/xpAction");
const createEmbeds = require("../utils/createEmbeds");

const OR_VOTE = 50;
const OR_BUMP = 150;
const XP_VOTE = 25;
const XP_BUMP = 50;

let voteId = [];

module.exports = {
    name: 'messageUpdate',
    async execute(oldMessage, newMessage) {
        if (newMessage.reactions && newMessage.reactions.message.embeds) {
            const msg = newMessage.reactions.message;
            if (newMessage.interaction) {
                if (msg.embeds.length > 0) {
                    const content = msg.embeds[0].description;
                    if (content && !voteId.includes(newMessage.id)) {
                        voteId.push(newMessage.id);
                        const user = newMessage.interaction.user;
                        if (content.includes('a Vot')) {
                            await orAction.increment(user.id, OR_VOTE);
                            await xpAction.increment(newMessage.guild, user.id, XP_VOTE);
                            const embed = createEmbeds.createFullEmbed(`Merci pour ton vote !`, user.toString()  + ', vous avez reçu **' + OR_VOTE + ' pièce(s) d\'or** et de l\'expérience.', null, null, null, null);
                            await newMessage.channel.send({content: "", embeds: [embed]});
                        } else if (content.includes('a BUMP')) {
                            await orAction.increment(user.id, OR_BUMP);
                            await xpAction.increment(newMessage.guild, user.id, XP_BUMP);
                            const embed = createEmbeds.createFullEmbed(`Merci pour ton bump !`, user.toString()  + ', vous avez reçu **' + OR_BUMP + ' pièce(s) d\'or** et de l\'expérience.', null, null, null, null);
                            await newMessage.channel.send({content: "", embeds: [embed]});
                        }
                        if (voteId.length > 10) {
                            // remove first item
                            voteId.shift();
                        }
                    }
                }
            }
        }
    },
};