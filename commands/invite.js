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
        let embed = createEmbeds.createFullEmbed('', '', null, null, 0x2f3136, null);

        if (!guest) {
            embed = createEmbeds.createFullEmbed('Vous n\'avez encore invité personne 😔', 'Vous pouvez inviter des gens...', null, null, 0x2f3136, null);
        }
        else if (guest == 1) {
            embed = createEmbeds.createFullEmbed('C\'est un bon début !', 'Vous avez invité **' + guest + " personne**", null, null, 0x2f3136, null);
        }
        else if (guest >= 2 && guest < 5) {
            embed = createEmbeds.createFullEmbed('Pas mal !', 'Vous avez invité **' + guest + ' utisateurs** !', null, null, 0x2f3136, null);
        }
        else if(guest>= 6 && guest < 10) {
    embed = createEmbeds.createFullEmbed('Ça fait beaucoup de monde !', 'Vous avez invité **' + guest + ' utisateurs** !', null, null, 0x2f3136, null);
}
        else if (guest >= 10) {
    embed = createEmbeds.createFullEmbed('Vous êtes légendaire !', 'Vous avez invité **' + guest + ' utisateurs** !\n C\'est incroyable d\'avoir autant de monde, vous êtes vraiment un grand fan de bouteille à la mer et nous vous remercions de votre fidélité ❤', null, null, 0x2f3136, null);
}
return interaction.reply({ content: "", embeds: [embed], ephemeral: true });
    },
};