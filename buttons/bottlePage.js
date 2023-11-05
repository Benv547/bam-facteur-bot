const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const bottleDB = require("../database/bottle");
const createEmbeds = require("../utils/createEmbeds");

module.exports = {
    name: 'bottlePage',
    async execute(interaction) {
        const page = parseInt(interaction.customId.split('_')[1]);

        const bottles = await bottleDB.getBottleForUserWithOffsetAndLimit(interaction.user.id, page, 10);
        let message = '';
        if (bottles.length === 0) {
            message = 'Vous n\'avez pas de bouteille !';
        } else {
            message += '📥 en attente de réponse de votre correspondant';
            message += '\n';
            message += '📨 en attente de votre réponse';
            message += '\n';
            message += '💀 bouteille terminée';
            message += '\n';
            message += '🗄️ bouteille archivée';
            message += '\n\n'

            bottles.forEach(bottle => {
                message += '• **' + bottle.name + '**\n';
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
                message += '**Statut** : ' + status + '\n\n';
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
                        .setStyle(ButtonStyle.Secondary),
                );
            return interaction.reply({ content: '', embeds: [embed], components: [row], ephemeral: true });
        }
        if (bottles.length < 10) {
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('bottlePage_' + (page - 1))
                        .setLabel('Précédent')
                        .setStyle(ButtonStyle.Secondary),
                );
            return interaction.reply({ content: '', embeds: [embed], components: [row], ephemeral: true });
        }
    },
};