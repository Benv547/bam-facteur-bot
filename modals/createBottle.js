const bottle = require("../utils/bottleAction");

module.exports = {
    name: 'createBottle',
    async execute(interaction) {

        const content = interaction.fields.getTextInputValue('textBottle');

        const sender = interaction.member;

        await interaction.reply({ content: 'Votre bouteille a été envoyée.', ephemeral: true });

        try {
            await bottle.create(interaction.guild, sender.id, content, 0);
        } catch (e) {
            console.log(e);
        }
    },
};