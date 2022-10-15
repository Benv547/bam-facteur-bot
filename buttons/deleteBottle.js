const bottleDB = require("../database/bottle");

module.exports = {
    name: 'deleteBottle',
    async execute(interaction) {
        // Send bottle terminated and archived
        await bottleDB.setBottleTerminated(interaction.channel.id);
        await bottleDB.setBottleArchived(interaction.channel.id);

        // Delete channel
        await interaction.channel.delete();

        // Reply to user
        await interaction.reply({ content: 'La bouteille a été supprimée.', ephemeral: true });
    },
};