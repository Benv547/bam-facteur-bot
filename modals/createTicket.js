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

        const content = interaction.fields.getTextInputValue('textTicket');
        if (content.trim() === '') {
            return await interaction.reply({content: "The message cannot be empty.", ephemeral: true});
        }

        // Check if user is already in a ticket
        const userTicket = await ticketDB.get_id_channel(interaction.user.id);
        if (userTicket) {
            await interaction.reply({ content: '⚠️ You already have a ticket in progress.', ephemeral: true });
            return;
        }

        const sender = interaction.member;

        try {
            // Create a button to reply to the ticket
            const rowUser = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('replyTicketUser')
                        .setLabel('Reply')
                        .setStyle(ButtonStyle.Primary),
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('deleteTicket')
                        .setLabel('Close the ticket')
                        .setStyle(ButtonStyle.Danger),
                );

            // Create embed for the user
            const embedUser = createEmbeds.createFullEmbed("You", content, null, null, 0x0000FF, null);
            // Send an MP message to the sender
            await sender.send({ content: 'Your ticket', embeds: [embedUser], components: [rowUser] });
        } catch (e) {
            return await interaction.reply({ content: '⚠️ Your ticket has not been created. **Thank you for allowing the bot to send you PMs**.', ephemeral: true });
        }

        await interaction.reply({ content: 'Your ticket has been submitted.', ephemeral: true });

        const count = await ticketDB.get_number_of_tickets();

        const n = parseInt(count) + 1;
        // Create a new channel for the ticket
        var channel = await interaction.guild.channels.create({
            name: 'ticket-n' + (n),
            type: ChannelType.GuildText
        });
        const mod = interaction.guild.roles.cache.get(modRole);
        await channel.permissionOverwrites.edit(mod.id, { ViewChannel: false, SendMessages: false });

        // Change category of the channel
        const category = interaction.guild.channels.cache.find(c => c.id == ticket);
        await channel.setParent(category);
        
        // Create a button to reply to the ticket
        const rowMod = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('replyTicketMod')
                    .setLabel('Reply')
                    .setStyle(ButtonStyle.Primary),
            ).addComponents(
                new ButtonBuilder()
                    .setCustomId('warning_ticket')
                    .setLabel('Report the ticket')
                    .setStyle(ButtonStyle.Secondary),
            ).addComponents(
                new ButtonBuilder()
                    .setCustomId('deleteTicket')
                    .setLabel('Close the ticket')
                    .setStyle(ButtonStyle.Danger),
            );
        const embed = createEmbeds.createFullEmbed("An illustrious stranger", content, null, null, 0x0000FF, null);
        // Send the message to the channel
        await channel.send({ content: mod.toString(), embeds: [embed], components: [rowMod] });

        // Save ticket to database
        await ticketDB.insertTicket(sender.user.id, channel.id, interaction.guild.id);
    },
};