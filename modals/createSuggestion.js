const {ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const createEmbeds = require("../utils/createEmbeds");
const suggestionDB = require("../database/suggestion");
const userDB = require("../database/user");

module.exports = {
    name: 'createSuggestion',
    async execute(interaction) {

        // Check if the user exists in the database
        const userId = await userDB.getUser(interaction.user.id);
        if (userId == null) {
            // Add the user to the database
            await userDB.createUser(interaction.user.id, 0, 0);
        }

        // Get content
        const content = interaction.fields.getTextInputValue('textSuggestion');
        if (content.trim() === '') {
            return await interaction.reply({content: "Le message ne peut pas être vide.", ephemeral: true});
        }

        // Create buttons to upvote and downvote and warn
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('upvoteSuggestion')
                    .setLabel('👍 0')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('downvoteSuggestion')
                    .setLabel('👎 0')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('replySuggestion')
                    .setLabel('Répondre')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('warning_suggestion')
                    .setLabel('⚠️')
                    .setStyle(ButtonStyle.Secondary),
            );

        // Create embed
        const embed = createEmbeds.createFullEmbed("Un•e illustre inconnu•e", content, null, null, 0x2F3136, null);

        // Get suggestion number
        const suggestionNumber = parseInt(await suggestionDB.getTotalNumberOfSuggestions()) + 1;

        // Send embed
        const message = await interaction.channel.send({ content: 'Suggestion n°' + suggestionNumber, embeds: [embed], components: [row] });
        const thread = await message.startThread({
            name: 'Suggestion n°' + suggestionNumber,
            autoArchiveDuration: 60,
            reason: 'Espace de discussion pour la suggestion n°' + suggestionNumber,
        });

        // Save message id in database
        await suggestionDB.insertSuggestions(message.id, thread.id, interaction.user.id, content, false);

        await interaction.reply({ content: 'Votre suggestion a été envoyée.', ephemeral: true });
    }
};