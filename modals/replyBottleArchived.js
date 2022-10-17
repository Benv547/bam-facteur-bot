const bottle = require("../utils/bottleAction");

module.exports = {
    name: 'replyBottleArchived',
    async execute(interaction) {

        const idBottle = interaction.fields.getTextInputValue('idBottle');
        const content = interaction.fields.getTextInputValue('textBottle');

        const sender = interaction.member;

        await interaction.reply({ content: 'Votre bouteille a été relancée.', ephemeral: true });

        try {
            await bottle.unarchive(interaction.guild, sender.id, idBottle, content);
        } catch (e) {
            console.log(e);
        }
    },
};