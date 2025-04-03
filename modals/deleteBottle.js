const bottleDB = require("../database/bottle");
const messageDB = require("../database/message");
const createEmbeds = require("../utils/createEmbeds");
const userDB = require("../database/user");
const bottle = require("../utils/bottleAction");

module.exports = {
    name: 'deleteBottle',
    async execute(interaction) {

        // Check if the user has confirmed the deletion
        const textSuppression = interaction.fields.getTextInputValue('textSuppression');
        let textRaison = interaction.fields.getTextInputValue('textRaison');
        if (!textSuppression.toLocaleLowerCase().includes('supprimer')) {
            await interaction.reply({ content: 'La bouteille n\'a pas été supprimée.', ephemeral: true });
            return;
        }

        textRaison = textRaison ? textRaison : 'Merci d\'avoir discuté avec moi, à très vite !';

        const sender = interaction.member;
        await interaction.update({ content: '', components: [] });

        try {
            await userDB.reset_afk_number(interaction.member.id);
            await bottle.delete(interaction.guild, sender.id, interaction.channel, textRaison);
        } catch (e) {
            console.log(e);
        }
    },
};