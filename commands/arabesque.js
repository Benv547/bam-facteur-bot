const { SlashCommandBuilder } = require('discord.js');
const footerDB = require("../database/footer");
const userDB = require("../database/user");
const createEmbeds = require("../utils/createEmbeds");

const DEFAULT = 8;

module.exports = {
    public: true,
    data: new SlashCommandBuilder()
        .setName('arabesque')
        .setDescription('Look and change the arabesque of your bottles!')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name of the arabesque')),
    async execute(interaction) {
        if (interaction.options.getString('name') === null) {
            const footers = await footerDB.getAllFootersFromUser(interaction.user.id);
            let message = '';
            if (footers === null) {
                message = 'You don\'t have any arabesque!';
            } else {
                message = 'Here\'s your arabesques:\n';
                for (const footer of footers) {
                    const footer_item = await footerDB.getFooter(footer.id_footer);
                    let rarity = 'common';
                    if (footer_item.sharable_percentage == 0) rarity = 'trophy'; // trophée
                    else if (footer_item.sharable_percentage <= 0.01) rarity = 'mythic'; // 1%
                    else if (footer_item.sharable_percentage <= 0.1) rarity = 'legendary'; // 10%
                    else if (footer_item.sharable_percentage <= 0.25) rarity = 'epic'; // 25%
                    else if (footer_item.sharable_percentage <= 0.5) rarity = 'uncommon'; // 50%
                    message += '• **' + footer_item.name + '** (*' + rarity + '*)\n';
                }
                message += '\n';
                const current_footer = await userDB.get_id_footer(interaction.user.id);
                if (current_footer !== null) {
                    const current_footer_item = await footerDB.getFooter(current_footer);
                    message += 'Your footer currently equipped is **' + current_footer_item.name + '**';
                } else {
                    message += 'You don\'t have any arabesque at the moment!';
                }
            }

            const embed = createEmbeds.createFullEmbed("Your arabesques", message, null, null, null, 'Do /arabesque <name> to change the arabesque');
            return interaction.reply({content: '', embeds: [embed], ephemeral: true});
        } else {
            let footer_name = interaction.options.getString('name');

            if (footer_name.toLocaleLowerCase().includes('défaut')) {
                const footer = await footerDB.getFooter(DEFAULT);
                await userDB.update_id_footer(interaction.user.id, DEFAULT);
                const embed = createEmbeds.createFullEmbed('Arabesque changed', 'Your arabesque was well changed!', null, footer.url, null, null);
                return interaction.reply({content: '', embeds: [embed], ephemeral: true});
            }

            const footer = await footerDB.getFooterFromUserWithName(interaction.user.id, footer_name);
            if (footer.length === 0) {
                return interaction.reply({content: 'This arabesque doesn\'t exist.', ephemeral: true});
            } else if (footer.length > 1) {
                return interaction.reply({content: 'Several arabesques have this name, please specify.', ephemeral: true});
            } else {
                await userDB.update_id_footer(interaction.user.id, footer[0].id_footer);

                const embed = createEmbeds.createFullEmbed('Arabesque changed', 'Your arabesque was well changed!', null, footer[0].url, null, null);
                return interaction.reply({content: '', embeds: [embed], ephemeral: true});
            }
        }
    },
};