const createEmbeds = require("../utils/createEmbeds");
const signalementDB = require("../database/signalement");
const userDB = require("../database/user");

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
        await sender.send({ content: '', embeds: [createEmbeds.createFullEmbed('Vous avez reçu un avertissement', 'Votre signalement a été jugé comme abusif par ' + mod.toString() + ' pour la raison suivante : ' + raison, null, null, 0x2f3136, null)] });

        // Increment number of warning
        await userDB.incr_nb_warn(id_sender);

        // Delete message
        await interaction.deferReply({ ephemeral: true })
        await interaction.deleteReply();
        await interaction.message.delete();
    }
};