const {ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const createEmbeds = require("../utils/createEmbeds");
const {modRole, newBottleCategory} = require("../config.json");
const ticketDB = require("../database/ticket");
const userDB = require("../database/user");
const {ticket} = require("../config.json");

module.exports = {
    name: 'createTicket',
    async execute(interaction) {

        // Check if the user exists in the database
        const userId = await userDB.getUser(interaction.user.id);
        if (userId == null) {
            // Add the user to the database
            await userDB.createUser(interaction.user.id, 0, 0);
        }

        // Check if user is already in a ticket
        const userTicket = await ticketDB.get_id_channel(interaction.user.id);
        if (userTicket) {
            await interaction.reply({ content: '⚠️ Vous avez déjà un ticket en cours.', ephemeral: true });
            return;
        }

        const content = interaction.fields.getTextInputValue('textTicket');

        const sender = interaction.member;

        try {
            // Create a button to reply to the ticket
            const rowUser = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('replyTicketUser')
                        .setLabel('Répondre')
                        .setStyle(ButtonStyle.Primary),
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('deleteTicket')
                        .setLabel('Fermer le ticket')
                        .setStyle(ButtonStyle.Danger),
                );

            // Create embed for the user
            const embedUser = createEmbeds.createFullEmbed("Vous", content, null, null, 0x0000FF, null);
            // Send an MP message to the sender
            await sender.send({ content: 'Votre ticket', embeds: [embedUser], components: [rowUser] });
        } catch (e) {
            return await interaction.reply({ content: '⚠️ Votre ticket n\'a pas été créé. **Merci d\'autoriser le bot à vous envoyer des MP**.', ephemeral: true });
        }

        await interaction.reply({ content: 'Votre ticket a été envoyé.', ephemeral: true });

        const count = await ticketDB.get_number_of_tickets();

        // Create a new channel for the ticket
        var channel = await interaction.guild.channels.create({
            name: 'ticket-n' + (count + 1),
            type: ChannelType.GuildText
        });

        // Change category of the channel
        const category = interaction.guild.channels.cache.find(c => c.id == ticket);
        await channel.setParent(category);
        
        // Create a button to reply to the ticket
        const rowMod = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('replyTicketMod')
                    .setLabel('Répondre')
                    .setStyle(ButtonStyle.Primary),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('deleteTicket')
                    .setLabel('Fermer le ticket')
                    .setStyle(ButtonStyle.Danger),
            );

        const mod = interaction.guild.roles.cache.get(modRole);

        const embed = createEmbeds.createFullEmbed("Un•e illuste inconnu•e", content, null, null, 0x0000FF, null);
        // Send the message to the channel
        await channel.send({ content: mod.toString(), embeds: [embed], components: [rowMod] });

        // Save ticket to database
        await ticketDB.insertTicket(sender.user.id, channel.id, interaction.guild.id);
    },
};