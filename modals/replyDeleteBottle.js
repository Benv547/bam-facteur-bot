const bottle = require("../utils/bottleAction");
const userDB = require("../database/user");

module.exports = {
    name: 'replyDeleteBottle',
    async execute(interaction) {

        const content = interaction.fields.getTextInputValue('textBottle');
        if (content.trim() === '') {
            return await interaction.reply({content: "Le message ne peut pas être vide.", ephemeral: true});
        }

        const sender = interaction.member;
        await interaction.update({ content: '', components: [] });

        try {
            await userDB.reset_afk_number(interaction.member.id);
            await bottle.replyDelete(interaction.guild, sender.id, interaction.channel, content);
        } catch (e) {
            console.log(e);
        }
    },
};