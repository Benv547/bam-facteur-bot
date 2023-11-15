const {ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const voteDB = require("../database/vote");
const suggestionDB = require("../database/suggestion");
const userDB = require("../database/user");

module.exports = {
    name: 'upvoteSuggestion',
    async execute(interaction) {

        const userId = await userDB.getUser(interaction.user.id);
        if (userId == null) {
            // Add the user to the database
            await userDB.createUser(interaction.user.id, 0, 0);
        }

        // Get the vote
        const vote = await voteDB.getVote(interaction.message.id, interaction.user.id);
        if (vote !== null) {
            await interaction.reply({ content: 'Vous avez déjà voté pour cette suggestion.', ephemeral: true });
            return;
        }

        // Update the vote
        await voteDB.insertVote(interaction.message.id, interaction.user.id, true);

        // Update the suggestion component
        // Create buttons to upvote and downvote and warn
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('upvoteSuggestion')
                    .setLabel(await voteDB.getNumberOfUpVotesOfAMessage(interaction.message.id))
                    .setEmoji('👍')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('downvoteSuggestion')
                    .setLabel(await voteDB.getNumberOfDownVotesOfAMessage(interaction.message.id))
                    .setEmoji('👎')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('replySuggestion')
                    .setLabel('Répondre')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('warning_suggestion')
                    .setLabel("\u200b")
                    .setEmoji('⚠️')
                    .setStyle(ButtonStyle.Secondary),
            );

        // Update the suggestion
        await interaction.message.edit({ content: interaction.message.content, embeds: interaction.message.embeds, components: [row] });

        // Reply to the user
        await interaction.reply({ content: 'Vous avez voté pour cette suggestion.', ephemeral: true });
    },
};