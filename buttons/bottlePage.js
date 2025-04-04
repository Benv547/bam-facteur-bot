const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const bottleDB = require("../database/bottle");
const createEmbeds = require("../utils/createEmbeds");

module.exports = {
    name: 'bottlePage',
    async execute(interaction) {
        const page = parseInt(interaction.customId.split('_')[1]);

        const bottles = await bottleDB.getBottleForUserWithOffsetAndLimit(interaction.user.id, page * 10, 10);
        let message = '';
        if (bottles.length === 0) {
            message = 'Vous n\'avez pas de bouteille !';
        } else {
            message += '📥 du côté de votre interlocuteur';
            message += '\n';
            message += '📨 de votre côté';
            message += '\n';
            message += '💀 bouteille terminée';
            message += '\n';
            message += '🗄️ bouteille archivée';
            message += '\n\n'

            bottles.forEach(bottle => {
                if (!bottle.archived && !bottle.terminated) {
                    message += '• <#' + bottle.id_channel + '> [';
                } else {
                    message += '• **' + bottle.name + '** [';
                }

                let status = '';
                if (bottle.archived) {
                    status = '🗄';
                }
                if (bottle.id_user_sender === interaction.user.id) {
                    status += '📨';
                } else {
                    status += '📥';
                }
                if (bottle.terminated) {
                    status = '💀';
                }
                message += status + ']\n';
            });
        }
        const embed = createEmbeds.createFullEmbed("Vos bouteilles", message, null, null, 0x2f3136, null);
        // Create an action row with navigation buttons
        if (page === 0 && bottles.length < 10) {
            return interaction.reply({ content: '', embeds: [embed], ephemeral: true });
        }
        if (page === 0) {
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('bottlePage_1')
                        .setLabel('Suivant')
                        .setEmoji('➡️')
                        .setStyle(ButtonStyle.Secondary),
                );
            return interaction.reply({ content: '', embeds: [embed], components: [row], ephemeral: true });
        }
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('bottlePage_' + (page - 1))
                    .setLabel('Précédent')
                    .setEmoji('⬅️')
                    .setStyle(ButtonStyle.Secondary),
            );
        return interaction.reply({ content: '', embeds: [embed], components: [row], ephemeral: true });
    },
};