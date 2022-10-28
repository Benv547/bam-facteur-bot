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
            embed = createEmbeds.createFullEmbed('Vous n\'avez encore invité personne 😔', 'Mais il n\'est pas trop tard pour remédier à cela !\n\n Pour créer une invitation, il vous suffit de cliquer sur le bouton \"inviter\" de discord, de copier le lien, et enfin d\'envoyer le lien a vos amis !\n\n**Attention** : - Ne faites pas de pub dans des serveurs discord ne l\'autorisant pas. Bouteilles à la mer décline toute responsabilités en cas de ban sur ces serveurs en question. \n\n-Pensez bien à créer votre propre lien, et de ne pas repartager celui d\'un autre utilisateur car sinon l\'invitation ne sera pas comptabilisée comme venant de votre part. (Aucun "remboursement" ne sera possible)', null, null, 0x2f3136, null);
        }
        else if (guest == 1) {
            embed = createEmbeds.createFullEmbed('C\'est un bon début !', 'Vous avez invité **' + guest + ' personne**\n\nContinuez sur cette voie !\n\nPour rappel, pour créer une invitation, il vous suffit de cliquer sur le bouton \"inviter\" de discord, de copier le lien, et enfin d\'envoyer le lien a vos amis !\n\n**Attention** : - Ne faites pas de pub dans des serveurs discord ne l\'autorisant pas. Bouteilles à la mer décline toute responsabilités en cas de ban sur ces serveurs en question. \n\n-Pensez bien à créer votre propre lien, et de ne pas repartager celui d\'un autre utilisateur car sinon l\'invitation ne sera pas comptabilisée comme venant de votre part. (Aucun "remboursement" ne sera possible)', null, null, 0x2f3136, null);
        }
        else if (guest >= 2 && guest < 5) {
            embed = createEmbeds.createFullEmbed('Pas mal !', 'Vous avez invité **' + guest + ' utisateurs** !\n\nContinue sur cette voie, tu t\'approche du grade VIP 👀\n\nPour rappel, pour créer une invitation, il vous suffit de cliquer sur le bouton \"inviter\" de discord, de copier le lien, et enfin d\'envoyer le lien a vos amis !\n\n**Attention** : - Ne faites pas de pub dans des serveurs discord ne l\'autorisant pas. Bouteilles à la mer décline toute responsabilités en cas de ban sur ces serveurs en question. \n\n-Pensez bien à créer votre propre lien, et de ne pas repartager celui d\'un autre utilisateur car sinon l\'invitation ne sera pas comptabilisée comme venant de votre part. (Aucun "remboursement" ne sera possible)', null, null, 0x2f3136, null);
        }
        else if(guest>= 6 && guest < 10) {
    embed = createEmbeds.createFullEmbed('Ça fait beaucoup de monde !', 'Vous avez invité **' + guest + ' utisateurs** !\n\nMais je suis certain que vous pouvez inviter encore plus de monde pour avoir le message caché ! 👀\n\nPour rappel, pour créer une invitation, il vous suffit de cliquer sur le bouton \"inviter\" de discord, de copier le lien, et enfin d\'envoyer le lien a vos amis !\n\n**Attention** : - Ne faites pas de pub dans des serveurs discord ne l\'autorisant pas. Bouteilles à la mer décline toute responsabilités en cas de ban sur ces serveurs en question. \n\n-Pensez bien à créer votre propre lien, et de ne pas repartager celui d\'un autre utilisateur car sinon l\'invitation ne sera pas comptabilisée comme venant de votre part. (Aucun "remboursement" ne sera possible)', null, null, 0x2f3136, null);
}
        else if (guest >= 10) {
    embed = createEmbeds.createFullEmbed('Vous êtes légendaire !', 'Vous avez invité **' + guest + ' utisateurs** !\n\n C\'est incroyable d\'avoir invité autant de monde, vous êtes vraiment un grand fan de __Bouteille à la mer__ et nous vous remercions de votre fidélité ❤', null, null, 0x2f3136, null);
}
return interaction.reply({ content: "", embeds: [embed], ephemeral: true });
    },
};