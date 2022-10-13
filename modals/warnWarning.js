const createEmbeds = require("../utils/createEmbeds");
const signalementDB = require("../database/signalement");
const userDB = require("../database/user");

module.exports = {
    name: 'warnWarning',
    async execute(interaction) {
        const raison = interaction.fields.getTextInputValue('raison');
        const mod = interaction.member;

        // Get sender id
        const id_receiver = await signalementDB.get_id_receiver(interaction.message.id);

        // Fetch receiver
        const receiver = await interaction.guild.members.fetch(id_receiver);

        // Send MP to sender
        await receiver.send({ content: '', embeds: [createEmbeds.createFullEmbed('Vous avez reçu un avertissement', 'Une de vos bouteille a été jugée comme inappropriée par ' + mod.toString() + ' pour la raison suivante : ' + raison, null, null, 0x2f3136, null)] });

        // Increment number of warning
        await userDB.incr_nb_warn(id_receiver);

        // Delete message
        await interaction.deferReply({ ephemeral: true })
        await interaction.deleteReply();
        await interaction.message.delete();
    }
};