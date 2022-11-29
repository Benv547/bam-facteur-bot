const bottle = require("../utils/bottleAction");

module.exports = {
    name: 'replyBottle',
    async execute(interaction) {

        const content = interaction.fields.getTextInputValue('textBottle');
        if (content.trim() === '') {
            return await interaction.reply({content: "Le message ne peut pas être vide.", ephemeral: true});
        }

        const sender = interaction.member;

        await interaction.update({ content: '', components: [] });

        try {
            await bottle.reply(interaction.guild, sender.id, interaction.channel, content);
        } catch (e) {
            console.log(e);
        }
    },
};