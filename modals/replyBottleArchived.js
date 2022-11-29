const bottle = require("../utils/bottleAction");

module.exports = {
    name: 'replyBottleArchived',
    async execute(interaction) {

        const idBottle = interaction.customId.split('_')[1];
        const content = interaction.fields.getTextInputValue('textBottle');
        if (content.trim() === '') {
            return await interaction.reply({content: "Le message ne peut pas être vide.", ephemeral: true});
        }

        const sender = interaction.member;

        await interaction.reply({ content: 'Votre bouteille a été relancée.', ephemeral: true });

        try {
            await bottle.unarchive(interaction.guild, sender.id, idBottle, content);
        } catch (e) {
            console.log(e);
        }
    },
};