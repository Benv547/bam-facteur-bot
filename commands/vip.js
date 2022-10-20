const { SlashCommandBuilder } = require('discord.js');
const createEmbeds = require("../utils/createEmbeds");
const roles = require('../utils/roles.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vip')
        .setDescription('Informations avantages des VIP.s !'),
    async execute(interaction) {
        const embedVipAlready = createEmbeds.createFullEmbed('😎 Le Pass VIP de Bouteille !', `${interaction.member} tu es **déjà VIP**, super !\nVoici les avantages que tu as :\n- Faire du **surf** sur les vagues de Bouteille à la mer !\n- Être une vraie **star** du serveur, la classe !\n- Un **gros bisous** de la part de Mushiuta !`, null, null, null);
        const embedNotVip = createEmbeds.createFullEmbed('😎 Le Pass VIP de Bouteille !', `Les VIP.s sont **les chouchous** de Bouteille à la mer ! Le Pass VIP peut t'être offert de **plusieurs manières** :\n- Inviter **10** de tes amis, *quelle célébrité* !\n- **Gagner** à un évènement ou une animation, *trop fort* !\n- **Trouver** dans un coffre aléatoire, *la chance* !\nCe grade a plusieurs **qualités**, il peut te permettre de :\n- Diminuer le **temps d'attente** pour l'envoi de nouvelles bouteilles.\n- Avoir **accès à des objets limités** dans la boutique.\n- Et d'autres **surprises** qui t'attendent avec impatience !`, null, null, null);


        if (await roles.userIsBooster(interaction.member)) {
            return await interaction.reply({ ephemeral: true, embeds: [embedVipAlready] });
        } else {
            return await interaction.reply({ ephemeral: true, embeds: [embedNotVip] });
        }
                
    },
};