const { SlashCommandBuilder } = require('discord.js');
const footerDB = require("../database/footer");
const userDB = require("../database/user");
const createEmbeds = require("../utils/createEmbeds");

const DEFAULT = 8;

module.exports = {
    public: true,
    data: new SlashCommandBuilder()
        .setName('arabesque')
        .setDescription('Regardez et changez l\'arabesque de vos bouteilles !')
        .addStringOption(option =>
            option.setName('nom')
                .setDescription('Le nom de l\'arabesque')),
    async execute(interaction) {
        if (interaction.options.getString('nom') === null) {
            const footers = await footerDB.getAllFootersFromUser(interaction.user.id);
            let message = '';
            if (footers === null) {
                message = 'Vous n\'avez pas d\'arabesque !';
            } else {
                message = 'Voici vos arabesques :\n';
                for (const footer of footers) {
                    const footer_item = await footerDB.getFooter(footer.id_footer);
                    let rarity = 'commun';
                    if (footer_item.sharable_percentage == 0) rarity = 'trophée'; // trophée
                    else if (footer_item.sharable_percentage <= 0.01) rarity = 'mythique'; // 1%
                    else if (footer_item.sharable_percentage <= 0.1) rarity = 'légendaire'; // 10%
                    else if (footer_item.sharable_percentage <= 0.25) rarity = 'épic'; // 25%
                    else if (footer_item.sharable_percentage <= 0.5) rarity = 'rare'; // 50%
                    message += '• **' + footer_item.name + '** (*' + rarity + '*)\n';
                }
                message += '\n';
                const current_footer = await userDB.get_id_footer(interaction.user.id);
                if (current_footer !== null) {
                    const current_footer_item = await footerDB.getFooter(current_footer);
                    message += 'Votre footer actuellement équipé est **' + current_footer_item.name + '**';
                } else {
                    message += 'Vous n\'avez pas d\'arabesque actuellement !';
                }
            }

            const embed = createEmbeds.createFullEmbed("Vos arabesques", message, null, null, null, 'Faite /arabesque <nom> pour changer d\'arabesque');
            return interaction.reply({content: '', embeds: [embed], ephemeral: true});
        } else {
            let footer_name = interaction.options.getString('nom');

            if (footer_name.toLocaleLowerCase().includes('défaut')) {
                const footer = await footerDB.getFooter(DEFAULT);
                await userDB.update_id_footer(interaction.user.id, DEFAULT);
                const embed = createEmbeds.createFullEmbed('Arabesque changée', 'Votre arabesque a bien été changée !', null, footer[0].url, null, null);
                return interaction.reply({content: '', embeds: [embed], ephemeral: true});
            }

            const footer = await footerDB.getFooterFromUserWithName(interaction.user.id, footer_name);
            if (footer.length === 0) {
                return interaction.reply({content: 'Cette arabesque n\'existe pas.', ephemeral: true});
            } else if (footer.length > 1) {
                return interaction.reply({content: 'Plusieurs arabesques ont ce nom, veuillez préciser.', ephemeral: true});
            } else {
                await userDB.update_id_footer(interaction.user.id, footer[0].id_footer);

                const embed = createEmbeds.createFullEmbed('Arabesque changée', 'Votre arabesque a bien été changée !', null, footer[0].url, null, null);
                return interaction.reply({content: '', embeds: [embed], ephemeral: true});
            }
        }
    },
};