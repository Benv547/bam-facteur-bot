const {ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder} = require("discord.js");

module.exports = {
    name: 'sanction',
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId(interaction.customId);

        const sanctionType = interaction.customId.split('_')[1];
        if (sanctionType === 'ban') {
            modal.setTitle('Reason for banishment');
        } else if (sanctionType === 'mute') {
            modal.setTitle('Reason for mute');
        } else if (sanctionType === 'warn') {
            modal.setTitle('Reason for warn');
        } else if (sanctionType === 'abusif') {
            modal.setTitle('Reason for abusive warn');
        }

        // Add components to modal
        let hobbiesInput = new TextInputBuilder()
            .setCustomId('raison')
            .setLabel("Why is the report justified?")
            // Paragraph means multiple lines of text.
            .setStyle(TextInputStyle.Paragraph)
            .setMaxLength(1500);

        if (sanctionType === 'abusif') {
            hobbiesInput = new TextInputBuilder()
                .setCustomId('raison')
                .setLabel("Why is the report abusive?")
                // Paragraph means multiple lines of text.
                .setStyle(TextInputStyle.Paragraph)
                .setMaxLength(1500);
        }

        // An action row only holds one text input,
        // so you need one action row per text input.
        const primaryActionRow = new ActionRowBuilder().addComponents(hobbiesInput);
        // Add inputs to the modal
        modal.addComponents(primaryActionRow);

        if (sanctionType === 'mute') {
            const timeoutInput = new TextInputBuilder()
                .setCustomId('timeout')
                .setLabel("How long? (in minutes)")
                .setStyle(TextInputStyle.Short);
            const secondActionRow = new ActionRowBuilder().addComponents(timeoutInput);
            // Add inputs to the modal
            modal.addComponents(secondActionRow);
        }

        // Show the modal to the user
        await interaction.showModal(modal);
    },
};