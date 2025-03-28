const bottleDB = require("../database/bottle");
const messageDB = require("../database/message");
const createEmbeds = require("../utils/createEmbeds");

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

        textRaison = textRaison ? textRaison : 'Aucune raison spécifiée';

        await messageDB.insertMessage(interaction.channel.id, interaction.channel.id, interaction.userId, textRaison);

        // Send bottle terminated and archived
        await bottleDB.setBottleTerminated(interaction.channel.id);
        await bottleDB.setBottleArchived(interaction.channel.id);

        const receiverId = await bottleDB.getReceiver(interaction.channel.id);
        const receiver = await interaction.guild.members.fetch(receiverId);
        if (receiver) {
            try {
                const bottle = await bottleDB.getBottle(interaction.channel.id);
                const embed = createEmbeds.createFullEmbed('Bouteille terminée', 'La ' + bottle.name + ' a été terminée par votre correspondant pour la raison suivante : ' + textRaison, null, null, null, null);
                await receiver.send({ embeds: [embed] });
            } catch {}
        }

        // Delete channel
        await interaction.channel.delete();

        // Reply to user
        await interaction.update({ components: [] });
    },
};