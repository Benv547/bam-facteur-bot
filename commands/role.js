const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
const roles = require('../utils/roles.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('Permet de créer un rôle dans le salon.')
        .addStringOption(option =>
            option.setName('emoji')
                .setDescription('The emoji of the role')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message id')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('role')
                .setDescription('The role id')
                .setRequired(true)),
    async execute(interaction) {
        if (await roles.userIsAdmin(interaction.member)) {
            // Fetch message from id
            const message = await interaction.channel.messages.fetch(interaction.options.getString('message'));
            // Get row
            let rowMessage = new ActionRowBuilder();

            if (message.components.length > 0 && message.components[0].components !== undefined) {
                for (var component of message.components[0].components) {
                    console.log(component);
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
                    .setCustomId('getRole_' + interaction.options.getString('role'))
                    .setLabel(interaction.options.getString('emoji'))
                    .setStyle(ButtonStyle.Secondary),
                );
            await message.edit({components: [rowMessage]});
            return await interaction.reply({ content:'C\'est fait.', ephemeral: true});
        }
        return interaction.reply({ content:'Vous n\'avez pas le droit de faire cela.', ephemeral: true});
    },
};