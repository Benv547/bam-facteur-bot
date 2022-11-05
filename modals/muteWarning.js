const createEmbeds = require("../utils/createEmbeds");
const signalementDB = require("../database/signalement");
const sanctionsDB = require("../database/sanctions");
const {sanction} = require("../config.json");
const bottleDB = require("../database/bottle");

module.exports = {
    name: 'muteWarning',
    async execute(interaction) {
        const timeout = interaction.fields.getTextInputValue('timeout');
        const raison = interaction.fields.getTextInputValue('raison');
        const mod = interaction.member;

        // Get sender id
        const id_receiver = await signalementDB.get_id_receiver(interaction.message.id);

        if (id_receiver === null) {
            await interaction.reply({content: "Ce signalement a déjà été traité ou n'éxiste plus.", ephemeral: true});
            return await interaction.message.delete();
        }

        // Fetch receiver
        const receiver = await interaction.guild.members.fetch(id_receiver);

        //Save the informations in the Sanctions tab
        await sanctionsDB.saveSanction(id_receiver, mod.id,"Mute", raison);

        // Mute receiver
        try {
            await receiver.timeout(parseInt(timeout) * 60 * 1000, raison);
        } catch (error) {
            console.log(error);
        }

        const id_bottle = await signalementDB.get_id_bottle(interaction.message.id);
        if (id_bottle !== null) {
            // Fetch bottle
            const bottle = await interaction.guild.channels.fetch(id_bottle);
            // delete the bottle
            await bottle.delete();
            await bottleDB.setBottleTerminated(id_bottle);
        }

        // Send MP to sender
        await receiver.send({ content: '', embeds: [createEmbeds.createFullEmbed('Vous avez été muté•e', 'Une de vos actions a été jugée comme inappropriée par ' + mod.toString() + ' pour la raison suivante : **' + raison + '**', null, null, 0x2f3136, null)] });

        // Delete message
        await interaction.reply({ content: 'Votre réponse au signalement a été envoyé.', ephemeral: true });
        await interaction.message.delete();

        // Fetch sanctions channel by id
        const channel = await interaction.guild.channels.fetch(sanction);
        // Send message
        await channel.send({ content: '', embeds: [createEmbeds.createFullEmbed('Mute', 'L\'utilisateur ' + receiver.toString() + ' a été muté par ' + mod.toString() + ' pour la raison suivante : **' + raison + '**', null, null, 0x2f3136, null)] });
    }
};