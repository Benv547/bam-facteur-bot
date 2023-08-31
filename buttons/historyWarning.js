const {ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder} = require("discord.js");
const messageDB = require("../database/message");
const signalementDB = require("../database/signalement");
const createEmbeds = require("../utils/createEmbeds");

module.exports = {
    name: 'historyWarning',
    async execute(interaction) {
        // TODO : Display bottle history

        const signalement = await signalementDB.getSignalement(interaction.message.id);
        const signalementBottle = await signalementDB.getSignalementBottle(interaction.message.id);
        const channelId = signalementBottle.id_bottle;
        const senderId = signalement.id_sender;

        let text = "";
        const messages = await messageDB.get10LastMessages(channelId);

        // reverse messages
        messages.reverse();

        // For each message
        for (let i = 0; i < messages.length; i++) {
            if (messages[i].id_user === senderId) {
                text += "📤 ";
            } else {
                text += "📥 ";
            }
            text += messages[i].content + "\n\n";
        }

        // Limit text to 1024 characters
        if (text.length > 1020) {
            text = text.substring(0, 1020);
            text += "...";
        }

        // Create embed
        const embed = createEmbeds.createFullEmbed('History', text, null, null, 0x2f3136, null);

        await interaction.reply({content: '', embeds: [embed], ephemeral: true});
    },
};