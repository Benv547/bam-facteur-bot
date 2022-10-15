const {ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const createEmbeds = require("../utils/createEmbeds");
const suggestionDB = require("../database/suggestion");
const userDB = require("../database/user");

module.exports = {
    name: 'replySuggestion',
    async execute(interaction) {

        // Check if the user exists in the database
        const userId = await userDB.getUser(interaction.user.id);
        if (userId == null) {
            // Add the user to the database
            await userDB.createUser(interaction.user.id, 0, 0);
        }

        // Get content
        const content = interaction.fields.getTextInputValue('textSuggestion');

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
                    .setCustomId('warnSuggestion')
                    .setLabel('⚠️')
                    .setStyle(ButtonStyle.Secondary),
            );

        // Create embed
        const embed = createEmbeds.createFullEmbed("Un•e illustre inconnu•e", content, null, null, 0x2F3136, null);

        // Fetch message
        const message = await interaction.channel.messages.fetch(interaction.message.id);

        // Get suggestion number
        const repliesNumber = parseInt(await suggestionDB.getTotalOfReplies()) + 1;

        // Send embed
        const reply = await message.reply({ content: 'Réponse n°' + repliesNumber, embeds: [embed], components: [row] });

        // Save message id in database
        await suggestionDB.insertSuggestions(reply.id, interaction.user.id, content, true);

        await interaction.reply({ content: 'Votre réponse a été envoyée.', ephemeral: true });
    }
};