const bottle = require("../utils/bottleAction");

module.exports = {
    name: 'replyBottle',
    async execute(interaction) {

        const content = interaction.fields.getTextInputValue('textBottle');

        const sender = interaction.member;

        await interaction.update({ content: '', components: [] });

        try {
            await bottle.reply(interaction.guild, sender.id, interaction.channel, content);
        } catch (e) {
            console.log(e);
        }
    },
};