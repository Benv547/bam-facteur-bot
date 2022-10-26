const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");
const bottleDB = require("../database/bottle");
const messageDB = require("../database/message");
const bottle = require("../utils/bottleAction");
const createEmbeds = require("../utils/createEmbeds");

module.exports = {
    name: 'seaBottle',
    async execute(interaction) {
        const nb = await bottleDB.get_sea(interaction.channel.id);

        // Delete components from message
        await interaction.update({ components: [] });
        // TODO: get author
        const sender_id = await bottleDB.getReceiver(interaction.channel.id);
        // TODO: get original message
        const original_message = await messageDB.getFirstMessage(interaction.channel.id);

        if (nb < 10) {
            await bottleDB.incr_sea(interaction.channel.id);
            // TODO: recreate a new bottle with the same content
            const result = await bottle.create(interaction.guild, sender_id, original_message, nb + 1);
        }
        else {
            //Cherche l'utilisateur qui a envoyé la bouteille à partir de son ID
            const sender = await interaction.guild.members.fetch(sender_id);
            //Crée l'embed
            const embedFlow = createEmbeds.createFullEmbed("Une de perdue, dix de retrouvées !", 'Une de vos bouteilles a coulé, elle contenait le message :\n"**' + original_message + '**"', null, null, null, null);
            //Envoie l'embed crée à l'utilisateur
            await sender.send({ content: '', embeds: [embedFlow] })
        }
        await messageDB.deleteAllMessagesOfBottle(interaction.channel.id);
        await bottleDB.deleteBottle(interaction.channel.id);
        await interaction.channel.delete();
    },
};