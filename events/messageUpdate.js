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
                        if (content.includes('voted')) {
                            await orAction.increment(user.id, OR_VOTE);
                            await xpAction.increment(newMessage.guild, user.id, XP_VOTE);
                            const embed = createEmbeds.createFullEmbed(`Thank you for your vote!`, user.toString()  + ', you have received **' + OR_VOTE + ' <:gold:1058066245154525265>** and <:xp:1058066266797113455>.', null, null, null, null);
                            await newMessage.channel.send({content: "", embeds: [embed]});
                        } else if (content.includes('a BUMP')) {
                            await orAction.increment(user.id, OR_BUMP);
                            await xpAction.increment(newMessage.guild, user.id, XP_BUMP);
                            const embed = createEmbeds.createFullEmbed(`Thank you for your bump!`, user.toString()  + ', you have received **' + OR_BUMP + ' <:gold:1058066245154525265>** and <:xp:1058066266797113455>.', null, null, null, null);
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