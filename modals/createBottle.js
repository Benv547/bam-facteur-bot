const bottle = require("../utils/bottleAction");

module.exports = {
    name: 'createBottle',
    async execute(interaction) {

        const content = interaction.fields.getTextInputValue('textBottle');

        const sender = interaction.member;

        try {
            await bottle.create(interaction.guild, sender.id, content);
        } catch (e) {
            console.log(e);
        }

        await interaction.reply({ content: 'Votre bouteille a été envoyée.', ephemeral: true });
    },
};