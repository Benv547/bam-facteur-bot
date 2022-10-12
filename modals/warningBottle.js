const bottle = require("../utils/bottleAction");

module.exports = {
    name: 'warningBottle',
    async execute(interaction) {

        const content = interaction.fields.getTextInputValue('textWarning');

        const sender = interaction.member;

        // TODO: Add a warning system

        await interaction.reply({ content: 'Votre signalement a été envoyé.', ephemeral: true });
    },
};