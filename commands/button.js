const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
const roles = require('../utils/roles.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('button')
        .setDescription('Create a button on the message.')
        .addStringOption(option =>
            option.setName('texte')
                .setDescription('The text of the button')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message id')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('custom_id')
                .setDescription('The id of button')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('style')
                .setDescription('The style id')
                .setRequired(true)),
    async execute(interaction) {
        if (await roles.userIsAdmin(interaction.member)) {
            // Fetch message from id
            const message = await interaction.channel.messages.fetch(interaction.options.getString('message'));
            // Get row
            let rowMessage = new ActionRowBuilder();

            if (message.components.length > 0 && message.components[0].components !== undefined) {
                for (var component of message.components[0].components) {
                    rowMessage.addComponents(
                        new ButtonBuilder()
                            .setCustomId(component.data.custom_id)
                            .setLabel(component.data.label)
                            .setStyle(component.data.style),
                    );
                }
            }

            // Add button to row
            rowMessage.addComponents(
                new ButtonBuilder()
                    .setCustomId(interaction.options.getString('custom_id'))
                    .setLabel(interaction.options.getString('texte'))
                    .setStyle(interaction.options.getString('style')),
            );
            await message.edit({components: [rowMessage]});
            return await interaction.reply({ content:'Done.', ephemeral: true});
        }
        return interaction.reply({ content:'You don\'t have the right to do that.', ephemeral: true});
    },
};