const {ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const createEmbeds = require("../utils/createEmbeds");
const opinionDB = require("../database/opinion");
const userDB = require("../database/user");
const xpAction = require("../utils/xpAction");

module.exports = {
    name: 'createOpinion',
    async execute(interaction) {

        // Check if the user exists in the database
        const userId = await userDB.getUser(interaction.user.id);
        if (userId == null) {
            // Add the user to the database
            await userDB.createUser(interaction.user.id, 0, 0);
        }

        // Get content
        const content = interaction.fields.getTextInputValue('textOpinion');
        if (content.trim() === '') {
            return await interaction.reply({content: "Le message ne peut pas être vide.", ephemeral: true});
        }

        // Check if the user dont have a opinion
        const opinion = await opinionDB.getOpinion(interaction.user.id);
        if (opinion !== null) {
            try {
                // Fetch message from database
                const messageId = await opinionDB.getOpinion(interaction.user.id);

                // Fetch message on channel
                const message = await interaction.channel.messages.fetch(messageId);

                // Delete message
                await message.delete();

                // Delete the old opinion
                await opinionDB.deleteOpinion(interaction.user.id);
            } catch (e) {
                console.error(e);
                return await interaction.reply({ content: 'Une erreur est survenue lors de la suppression de votre avis.', ephemeral: true });
            }
        } else {
            await xpAction.increment(interaction.guild, interaction.member.id, 250);
        }

        // Create embed
        const embed = createEmbeds.createFullEmbed("Un•e illustre inconnu•e", content, null, null, 0x2F3136, null);

        // Send embed
        const message = await interaction.channel.send({ content: '', embeds: [embed] });

        // Save message id in database
        await opinionDB.insertOpinion(message.id, interaction.user.id, content);

        await interaction.reply({ content: 'Votre opinion a été envoyée.', ephemeral: true });
    }
};