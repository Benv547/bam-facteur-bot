const createEmbeds = require("../utils/createEmbeds");
const signalementDB = require("../database/signalement");
const userDB = require("../database/user");
const sanctionsDB = require("../database/sanctions");
const {sanction} = require("../config.json");
const bottleDB = require("../database/bottle");

module.exports = {
    name: 'abusifWarning',
    async execute(interaction) {
        const raison = interaction.fields.getTextInputValue('raison');
        const mod = interaction.member;

        // Get sender id
        const id_sender = await signalementDB.get_id_sender(interaction.message.id);

        if (id_sender === null) {
            await interaction.reply({content: "Ce signalement a déjà été traité ou n'éxiste plus.", ephemeral: true});
            return await interaction.message.delete();
        }

        // Fetch sender
        const sender = await interaction.guild.members.fetch(id_sender);

        // Send MP to sender
        await sender.send({ content: '', embeds: [createEmbeds.createFullEmbed('Vous avez reçu un avertissement', 'Votre signalement a été jugé comme abusif par ' + mod.toString() + ' pour la raison suivante : **' + raison + '**', null, null, 0x2f3136, null)] });

        //Save the informations in the Sanctions tab
        await sanctionsDB.saveSanction(id_sender, mod.id,"Warn abusif", raison);

        const id_bottle = await signalementDB.get_id_bottle(interaction.message.id);
        if (id_bottle !== null) {
            // Fetch bottle
            const bottle = await interaction.guild.channels.fetch(id_bottle);
            // delete the bottle
            await bottle.delete();
            await bottleDB.setBottleTerminated(id_bottle);
        } else {
            const messageToDelete = await signalementDB.get_id_warn(interaction.message.id);
            if (messageToDelete !== null) {
                try {
                    const channelWhereDelete = await signalementDB.get_id_channel(interaction.message.id);
                    // Fetch channel
                    const channel = await interaction.guild.channels.fetch(channelWhereDelete);
                    // Fetch message
                    const message = await channel.messages.fetch(messageToDelete);
                    // delete the message
                    await message.delete();
                } catch {}
            }
        }

        // Delete message
        await interaction.reply({ content: 'Votre réponse au signalement a été envoyé.', ephemeral: true });
        await interaction.message.delete();

        // Fetch sanctions channel by id
        const channel = await interaction.guild.channels.fetch(sanction);
        // Send message
        await channel.send({ content: '', embeds: [createEmbeds.createFullEmbed('Signalement abusif', 'L\'utilisateur ' + sender.toString() + ' a été averti par ' + mod.toString() + ' pour la raison suivante : **' + raison + '**', null, null, 0x2f3136, null)] });
    }
};