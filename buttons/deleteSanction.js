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
            return await interaction.reply({ content: 'An error occurred when deleting the report.', ephemeral: true });
        }
        return await interaction.reply({ content: 'The alert has been deleted (bug).', ephemeral: true });
    }
};