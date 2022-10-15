const createEmbeds = require("../utils/createEmbeds");
const signalementDB = require("../database/signalement");

module.exports = {
    name: 'banWarning',
    async execute(interaction) {
        const raison = interaction.fields.getTextInputValue('raison');
        const mod = interaction.member;

        // Get sender id
        const id_receiver = await signalementDB.get_id_receiver(interaction.message.id);

        // Fetch receiver
        const receiver = await interaction.guild.members.fetch(id_receiver);

        // Send MP to sender
        await receiver.send({ content: '', embeds: [createEmbeds.createFullEmbed('Vous avez été banni•e', 'Une de vos actions a été jugée comme inappropriée par ' + mod.toString() + ' pour la raison suivante : ' + raison, null, null, 0x2f3136, null)] });

        // Mute receiver
        await receiver.ban({ deleteMessageSeconds: 60 * 60 * 24 * 7, reason: raison });

        // Delete message
        await interaction.deferReply({ ephemeral: true })
        await interaction.deleteReply();
        await interaction.message.delete();
    }
};