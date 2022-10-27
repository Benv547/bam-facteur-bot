const createEmbeds = require("../utils/createEmbeds");
const signalementDB = require("../database/signalement");
const sanctionsDB = require("../database/sanctions");
const {sanction} = require("../config.json");

module.exports = {
    name: 'banWarning',
    async execute(interaction) {
        const raison = interaction.fields.getTextInputValue('raison');
        const mod = interaction.member;

        // Get sender id
        const id_receiver = await signalementDB.get_id_receiver(interaction.message.id);

        if (id_receiver === null) {
            return await interaction.reply({content: "Ce signalement a déjà été traité ou n'éxiste plus.", ephemeral: true});
        }

        // Fetch receiver
        const receiver = await interaction.guild.members.fetch(id_receiver);

        //Save the informations in the Sanctions tab
        await sanctionsDB.saveSanction(id_sender, mod.id,"Ban", raison);

        // Send MP to sender
        await receiver.send({ content: '', embeds: [createEmbeds.createFullEmbed('Vous avez été banni•e', 'Une de vos actions a été jugée comme inappropriée par ' + mod.toString() + ' pour la raison suivante : **' + raison + '**', null, null, 0x2f3136, null)] });

        // Ban receiver
        try {
            await receiver.ban({ deleteMessageSeconds: 60 * 60 * 24 * 7, reason: raison });
        } catch (error) {
            console.log(error);
        }

        

        // Delete message
        await interaction.reply({ content: 'Votre réponse au signalement a été envoyé.', ephemeral: true });
        await interaction.message.delete();

        // Fetch sanctions channel by id
        const channel = await interaction.guild.channels.fetch(sanction);
        // Send message
        await channel.send({ content: '', embeds: [createEmbeds.createFullEmbed('Ban', 'L\'utilisateur ' + receiver.toString() + ' a été banni par ' + mod.toString() + ' pour la raison suivante : **' + raison + '**', null, null, 0x2f3136, null)] });
    }
};