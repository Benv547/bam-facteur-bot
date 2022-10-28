const { SlashCommandBuilder } = require('discord.js');
const createEmbeds = require("../utils/createEmbeds");
const userDB = require('../database/user.js');

module.exports = {
    public: true,
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Consultez le nombre de personnes que vous avez invités'),
    async execute(interaction) {
        // Get the user's currency
        const guest = await userDB.get_nb_invite(interaction.user.id);
        const embed = createEmbeds.createFullEmbed('Ça fait beaucoup de monde !', 'Vous avez invité **' + guest + ' utisateurs** !', null, null, 0x2f3136, null);
        return interaction.reply({ content: "", embeds: [embed], ephemeral:true });
    },
};