const {ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder} = require("discord.js");
const bottleDB = require("../database/bottle");
const messageDB = require("../database/message");
const bottle = require("../utils/bottleAction");

module.exports = {
    name: 'seaBottle',
    async execute(interaction) {
        const nb = await bottleDB.get_sea(interaction.channel.id);

        // Delete components from message
        await interaction.update({ components: [] });

        if (nb < 10) {
            await bottleDB.incr_sea(interaction.channel.id);
            // TODO: get author
            const sender_id = await bottleDB.getReceiver(interaction.channel.id);
            // TODO: get original message
            const original_message = await messageDB.getFirstMessage(interaction.channel.id);
            // TODO: recreate a new bottle with the same content
            const result = await bottle.create(interaction.guild, sender_id, original_message, nb + 1);
        }
        await messageDB.deleteAllMessagesOfBottle(interaction.channel.id);
        await bottleDB.deleteBottle(interaction.channel.id);
        await interaction.channel.delete();
    },
};