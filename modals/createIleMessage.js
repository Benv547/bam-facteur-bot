const {ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const createEmbeds = require("../utils/createEmbeds");
const message_ileDB = require("../database/message_ile");
const userDB = require("../database/user");
const orAction = require("../utils/orAction");

module.exports = {
    name: 'createIleMessage',
    async execute(interaction) {

        // Check if the user exists in the database
        const userId = await userDB.getUser(interaction.user.id);
        if (userId == null) {
            // Add the user to the database
            await userDB.createUser(interaction.user.id, 0, 0);
        }

        const price = 10;
        if(!await orAction.reduce(interaction.user.id, price)) {
            const embed = createEmbeds.createFullEmbed('Il manque quelque chose..', 'Vous n\'avez pas assez d\'argent pour envoyer un message ! Economisez **' + price + ' pièces d\'or** et revenez me voir !', null, null, null, null);
            return interaction.reply({ content: "", embeds: [embed], ephemeral: true });
        }

        // Get content
        const content = interaction.fields.getTextInputValue('textMessage');

        // Create buttons to upvote and downvote and warn
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('replyIleMessage')
                    .setLabel('📩️')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('createIleMessage')
                    .setLabel('✉️')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('warnIleMessage')
                    .setLabel('⚠️')
                    .setStyle(ButtonStyle.Secondary),
            );

        // Create embed
        const embed = createEmbeds.createFullEmbed("Un•e illustre inconnu•e", content, null, null, 0x2F3136, null, false);


        // Send embed
        const message = await interaction.channel.send({ content: '** **', embeds: [embed], components: [row] });

        // Save message id in database
        await message_ileDB.insertMessage(message.id, userId.id_user, interaction.channel.id, interaction.guild.id, content);

        // Don't change interaction message
        await interaction.update({ content: interaction.message.content, embeds: interaction.message.embeds, components: interaction.message.components });
    }
};