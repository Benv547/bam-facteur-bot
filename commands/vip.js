const { SlashCommandBuilder } = require('discord.js');
const createEmbeds = require("../utils/createEmbeds");
const roles = require('../utils/roles.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vip')
        .setDescription('Informations about the benefits of VIP\'s!'),
    async execute(interaction) {

        const text = '\n\nThese are the benefits you get:' +
            '\n- Get **25% off** your purchases!' +
            '\n- Be able to **change your nickname** on the server!' +
            '\n- An **even shorter** time to send your bottles!' +
            '\n- **Surfing** on the waves of Bottle in the sea!';

        const textVIP = 'You are **already VIP**, awesome!' + text;
        const textNotVIP = 'VIP\'s are **the darlings** of Bottle in the sea!' +
            '\nThe V.I.P. can be obtained in **several ways:**\n- Invite **5** of your friends, *huge celebrity*!\n- **Win** to an event or an animation, *too strong*!' + text;

        const embedVipAlready = createEmbeds.createFullEmbed('Very Illustrious Person!', textVIP, null, null, null);
        const embedNotVip = createEmbeds.createFullEmbed('Very Illustrious Person!', textNotVIP, null, null, null);


        if (await roles.userIsVip(interaction.member)) {
            return await interaction.reply({ ephemeral: true, embeds: [embedVipAlready] });
        } else {
            return await interaction.reply({ ephemeral: true, embeds: [embedNotVip] });
        }
                
    },
};