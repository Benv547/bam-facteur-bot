const birdDB = require("../database/bird");
module.exports = {
    name: 'replyBird',
    async execute(interaction) {
        const emojiId = interaction.customId.split('_')[1];
        if (emojiId) {
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