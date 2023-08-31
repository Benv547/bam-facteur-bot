const birdDB = require("../database/bird");
const userDB = require("../database/user");
const xpAction = require("../utils/xpAction");
module.exports = {
    name: 'replyBird',
    async execute(interaction) {
        const emojiId = interaction.customId.split('_')[1];
        if (emojiId) {

            if (await userDB.getUser(interaction.member.id) === null) {
                await userDB.createUser(interaction.member.id, 0, 0);
            }

            const bird = await birdDB.getBird(interaction.channelId);
            if (bird == null) {
                return await interaction.reply({ content: 'This bird is no longer available.', ephemeral: true });
            }
            const old = await birdDB.getReactionByUser(bird.id_bird, interaction.member.id);
            if (old) {
                return await interaction.reply({ content: 'You have already reacted to this bird.', ephemeral: true });
            }
            await birdDB.insertBirdReaction(bird.id_bird, interaction.member.id, emojiId);
            await xpAction.increment(interaction.guild, interaction.member.id, 15);
            return await interaction.reply({ content: 'Your reaction has been acted upon.', ephemeral: true });
        }
    }
};