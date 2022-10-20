const bottleDB = require("../database/bottle");

module.exports = {
    name: 'deleteBottle',
    async execute(interaction) {

        // Check if the user has confirmed the deletion
        const textSuppression = interaction.fields.getTextInputValue('textSuppression');
        if (textSuppression.toLocaleLowerCase() !== 'supprimer') {
            await interaction.reply({ content: 'La bouteille n\'a pas été supprimée.', ephemeral: true });
            return;
        }

        // Send bottle terminated and archived
        await bottleDB.setBottleTerminated(interaction.channel.id);
        await bottleDB.setBottleArchived(interaction.channel.id);

        // Delete channel
        await interaction.channel.delete();

        // Reply to user
        await interaction.update({ components: [] });
    },
};