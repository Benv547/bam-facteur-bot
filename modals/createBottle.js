module.exports = {
    name: 'createBottle',
    async execute(interaction) {
        const text = interaction.fields.getTextInputValue('textBottle');
        // TODO: edit text and sent it.
        await interaction.reply({ content: 'Votre bouteille a été envoyée.', ephemeral: true });
    },
};