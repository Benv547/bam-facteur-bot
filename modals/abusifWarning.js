const createEmbeds = require("../utils/createEmbeds");
const signalementDB = require("../database/signalement");
const userDB = require("../database/user");
const {sanction} = require("../config.json");

module.exports = {
    name: 'abusifWarning',
    async execute(interaction) {
        const raison = interaction.fields.getTextInputValue('raison');
        const mod = interaction.member;

        // Get sender id
        const id_sender = await signalementDB.get_id_sender(interaction.message.id);

        // Fetch sender
        const sender = await interaction.guild.members.fetch(id_sender);

        // Send MP to sender
        await sender.send({ content: '', embeds: [createEmbeds.createFullEmbed('Vous avez reçu un avertissement', 'Votre signalement a été jugé comme abusif par ' + mod.toString() + ' pour la raison suivante : **' + raison + '**', null, null, 0x2f3136, null)] });

        // Increment number of warning
        await userDB.incr_nb_warn(id_sender);

        // Delete message
        await interaction.reply({ content: 'Votre réponse au signalement a été envoyé.', ephemeral: true });
        await interaction.message.delete();

        // Fetch sanctions channel by id
        const channel = await interaction.guild.channels.fetch(sanction);
        // Send message
        await channel.send({ content: '', embeds: [createEmbeds.createFullEmbed('Signalement abusif', 'L\'utilisateur ' + sender.toString() + ' a été averti par ' + mod.toString() + ' pour la raison suivante : **' + raison + '**', null, null, 0x2f3136, null)] });
    }
};