const bottle = require("../utils/bottleAction");
const createEmbeds = require("../utils/createEmbeds");
const {modRole} = require("../config.json");
const TicketDB = require("../database/ticket");
const {ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");

module.exports = {
    name: 'replyTicketMod',
    async execute(interaction) {

        const content = interaction.fields.getTextInputValue('textTicket');

        const sender = interaction.member;

        await interaction.reply({ content: 'Votre réponse a été envoyée.', ephemeral: true });

        // Create a button to reply to the ticket
        const rowMod = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('replyTicketMod')
                    .setLabel('Répondre')
                    .setStyle(ButtonStyle.Primary),
            );

        const embedMod = createEmbeds.createFullEmbed(sender.username, content, null, null, 0x00FF00, null);
        await interaction.channel.send({ content: '', embeds: [embedMod], components: [rowMod] });

        // Create a button to reply to the ticket
        const rowUser = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('replyTicketUser')
                    .setLabel('Répondre')
                    .setStyle(ButtonStyle.Primary),
            );


        // Fetch user from database
        const user = await TicketDB.get_id_user(interaction.channel.id);
        // Fetch user from guild
        const userGuild = interaction.guild.members.cache.get(user);
        const embedUser = createEmbeds.createFullEmbed(sender.username, content, null, null, 0x0000FF, null);
        // Send an MP message to the sender
        await userGuild.send({ content: 'Réponse du ticket', embeds: [embedUser], components: [rowUser] });
    },
};