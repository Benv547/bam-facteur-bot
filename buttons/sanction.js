const {ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder} = require("discord.js");

module.exports = {
    name: 'sanction',
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId(interaction.customId);

        const sanctionType = interaction.customId.split('_')[1];
        if (sanctionType === 'ban') {
            modal.setTitle('Raison du bannissement');
        } else if (sanctionType === 'mute') {
            modal.setTitle('Raison du mute');
        } else if (sanctionType === 'warn') {
            modal.setTitle('Raison du warn');
        } else if (sanctionType === 'abusif') {
            modal.setTitle('Raison du warn abusif');
        }

        // Add components to modal
        let hobbiesInput = new TextInputBuilder()
            .setCustomId('raison')
            .setLabel("Pourquoi le signalement est justifié ?")
            // Paragraph means multiple lines of text.
            .setStyle(TextInputStyle.Paragraph)
            .setMaxLength(1500);

        if (sanctionType === 'abusif') {
            hobbiesInput = new TextInputBuilder()
                .setCustomId('raison')
                .setLabel("Pourquoi le signalement est abusif ?")
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
                .setLabel("Combien de temps ? (en minutes)")
                .setStyle(TextInputStyle.Short);
            const secondActionRow = new ActionRowBuilder().addComponents(timeoutInput);
            // Add inputs to the modal
            modal.addComponents(secondActionRow);
        }

        // Show the modal to the user
        await interaction.showModal(modal);
    },
};