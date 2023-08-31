const bottle = require("../utils/bottleAction");

module.exports = {
    name: 'replyBottleArchived',
    async execute(interaction) {

        const idBottle = interaction.customId.split('_')[1];
        const content = interaction.fields.getTextInputValue('textBottle');
        if (content.trim() === '') {
            return await interaction.reply({content: "The message cannot be empty.", ephemeral: true});
        }

        const sender = interaction.member;

        await interaction.reply({ content: 'Your bottle has been relaunched.', ephemeral: true });

        try {
            await bottle.unarchive(interaction.guild, sender.id, idBottle, content);
        } catch (e) {
            console.log(e);
        }
    },
};