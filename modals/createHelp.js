const {ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const createEmbeds = require("../utils/createEmbeds");
const helpDB = require("../database/help");
const userDB = require("../database/user");

module.exports = {
    name: 'createHelp',
    async execute(interaction) {

        // Check if the user exists in the database
        const userId = await userDB.getUser(interaction.user.id);
        if (userId == null) {
            // Add the user to the database
            await userDB.createUser(interaction.user.id, 0, 0);
        }

        // Get content
        const content = interaction.fields.getTextInputValue('textHelp');
        if (content.trim() === '') {
            return await interaction.reply({content: "Le message ne peut pas être vide.", ephemeral: true});
        }

        // Create buttons to reply and warn
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('replyHelp')
                    .setLabel('Répondre')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('warning_help')
                    .setLabel('⚠️')
                    .setStyle(ButtonStyle.Secondary),
            );

        // Create embed
        const embed = createEmbeds.createFullEmbed("Un•e illustre inconnu•e", content, null, null, 0x2F3136, null);

        // Get suggestion number
        const helpNumber = parseInt(await helpDB.getTotalNumberOfHelp()) + 1;

        const message = await interaction.channel.send({ content: 'Demande d\'aide n°' + helpNumber, embeds: [embed], components: [row] });
        const thread = await message.startThread({
            name: 'Demande d\'aide n°' + helpNumber,
            autoArchiveDuration: 60,
            reason: 'Espace de discussion pour la demande d\'aide n°' + helpNumber,
        });

        // Save message id in database
        await helpDB.insertHelp(message.id, thread.id, interaction.user.id, content, false);

        await interaction.reply({ content: 'Votre demande d\'aide a été envoyée.', ephemeral: true });
    }
};