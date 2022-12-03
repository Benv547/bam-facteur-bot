const { SlashCommandBuilder } = require('discord.js');
const createEmbeds = require("../utils/createEmbeds");
const roles = require('../utils/roles.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vip')
        .setDescription('Informations sur les avantages des VIP.s !'),
    async execute(interaction) {

        const text = '\n\nVoici les avantages que tu as :' +
            '\n- Faire du **surf** sur les vagues de Bouteille à la mer !' +
            '\n- Avoir des **réductions de 25%** sur tes achats !' +
            '\n- Un **temps réduit** sur l\'envoi de tes bouteilles !';

        const textVIP = 'Tu es **déjà VIP**, super !' + text;
        const textNotVIP = 'Les VIP.s sont **les chouchous** de Bouteille à la mer !' +
            '\nLe V.I.P. peut t\'être offert de **plusieurs manières** :\n- Inviter **5** de tes amis, *quelle célébrité* !\n- **Gagner** à un évènement ou une animation, *trop fort* !' + text;

        const embedVipAlready = createEmbeds.createFullEmbed('Very Illustre Personne !', textVIP, null, null, null);
        const embedNotVip = createEmbeds.createFullEmbed('Very Illustre Personne !', textNotVIP, null, null, null);


        if (await roles.userIsVip(interaction.member)) {
            return await interaction.reply({ ephemeral: true, embeds: [embedVipAlready] });
        } else {
            return await interaction.reply({ ephemeral: true, embeds: [embedNotVip] });
        }
                
    },
};