const birdDB = require("../database/bird");
const userDB = require("../database/user");
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
                return await interaction.reply({ content: 'Ce message n\'est plus disponible.', ephemeral: true });
            }
            const old = await birdDB.getReactionByUser(bird.id_bird, interaction.member.id);
            if (old) {
                return await interaction.reply({ content: 'Vous avez déjà réagi à ce message.', ephemeral: true });
            }
            await birdDB.insertBirdReaction(bird.id_bird, interaction.member.id, emojiId);
            return await interaction.reply({ content: 'Votre réaction a été prise en compte.', ephemeral: true });
        }
    }
};