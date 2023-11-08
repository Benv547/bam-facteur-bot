const birdDB = require("../database/bird");
const userDB = require("../database/user");
const xpAction = require("../utils/xpAction");
const createEmbeds = require("../utils/createEmbeds");
module.exports = {
    name: 'replyBird',
    async execute(interaction) {
        const emojiId = interaction.customId.split('_')[1];
        if (emojiId) {
            let emoji = ''
            switch (emojiId) {
                case 'love':
                    emoji = '😍';
                    break;
                case 'joy':
                    emoji = '😂';
                    break;
                case 'mouth':
                    emoji = '😮';
                    break;
                case 'cry':
                    emoji = '😢';
                    break;
            }
            if (await userDB.getUser(interaction.member.id) === null) {
                await userDB.createUser(interaction.member.id, 0, 0);
            }

            const bird = await birdDB.getBird(interaction.message.id);
            if (bird == null) {
                return await interaction.reply({ content: 'Ce message n\'est plus disponible.', ephemeral: true });
            }
            const old = await birdDB.getReactionByUser(bird.id_bird, interaction.member.id);
            if (old) {
                return await interaction.reply({ content: 'Vous avez déjà réagi à ce message.', ephemeral: true });
            }
            if (bird.id_user === interaction.member.id) {
                return await interaction.reply({ content: 'Vous ne pouvez pas réagir à votre propre message.', ephemeral: true });
            }

            // update message embed footer
            const message = await interaction.channel.messages.fetch(interaction.message.id);
            let newContent = '1 réaction(s)';
            try {
                let reactionCount = parseInt(message.content.split(' ')[0]);
                if (isNaN(reactionCount)) reactionCount = 0;
                const newReactionCount = reactionCount + 1;
                newContent = newReactionCount + ' réaction(s)';
            } catch {}
            await message.edit({ content: newContent, embeds: message.embeds });
            
            await birdDB.insertBirdReaction(bird.id_bird, interaction.member.id, emoji);
            await xpAction.increment(interaction.guild, interaction.member.id, 15);
            return await interaction.reply({ content: 'Votre réaction a été prise en compte.', ephemeral: true });
        }
    }
};