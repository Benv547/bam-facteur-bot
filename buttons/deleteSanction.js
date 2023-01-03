const signalementDB = require("../database/signalement");
require("../utils/createEmbeds");

module.exports = {
    name: 'deleteSanction',
    async execute(interaction) {
        // Delete channel
        try {
            await signalementDB.deleteSignalement(interaction.messageId);
            await interaction.message.delete();
        } catch (e) {
            console.error(e);
            return await interaction.reply({ content: 'Une erreur est survenue lors de la suppression du signalement.', ephemeral: true });
        }
        return await interaction.reply({ content: 'Le signalement a été supprimé (bug).', ephemeral: true });
    }
};