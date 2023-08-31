const { SlashCommandBuilder } = require('discord.js');
const createEmbeds = require("../utils/createEmbeds");
const userDB = require('../database/user.js');
const inviteDB = require('../database/invite.js');

module.exports = {
    public: true,
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Check the number of people you have invited'),
    async execute(interaction) {
        // Get the user's currency

        const userId = await userDB.getUser(interaction.user.id);
        if (userId == null) {
            // Add the user to the database
            await userDB.createUser(interaction.user.id, 0, 0);
        }

        const guest = await inviteDB.getNumberOfInvite(interaction.user.id);
        let embed = createEmbeds.createFullEmbed('', '', null, null, 0x2f3136, null);

        if (guest == 0) {
            embed = createEmbeds.createFullEmbed('You haven\'t invited anyone yet, but it\'s not too late to change that!\n\n To create an invitation, just click on the "invite" button on the discord, copy the link, and then send the link to your friends!\n Be careful, only share your link if you want the invitation to count.', null, null, 0x2f3136, null);
        }
        else if (guest == 1) {
            embed = createEmbeds.createFullEmbed('It\'s a good start !', 'You have invited **' + guest + ' people**\n\nKeep it up!\n\n As a reminder, to create an invitation, you just have to click on the "invite" button of the Discord, copy the link, and send it to your friends !\n Be careful, only share your link if you want the invitation to be counted.', null, null, 0x2f3136, null);
        }
        else if (guest >= 2 && guest < 5) {
            embed = createEmbeds.createFullEmbed('Pas mal !', 'You have invited **' + guest + ' guests** !\n\nKeep it up, you\'re approaching the **VIP** grade 👀\n\n As a reminder, to create an invitation, you just have to click on the "invite" button of the Discord, copy the link, and send it to your friends !\n Be careful, only share your link if you want the invitation to be counted.', null, null, 0x2f3136, null);
        }
        else if(guest>= 5 && guest < 10) {
            embed = createEmbeds.createFullEmbed('That\'s a lot of people!', 'You have invited **' + guest + ' users** !\n\n But I\'m sure you can invite **even more people** to see the **hidden message**! 👀\n\n As a reminder, to create an invitation, you just have to click on the "invite" button of the Discord, copy the link, and send it to your friends !\n Be careful, only share your link if you want the invitation to be counted.', null, null, 0x2f3136, null);
        }
        else if (guest >= 10) {
            embed = createEmbeds.createFullEmbed('You\'re legendary!', 'You have invited **' + guest + ' guests** !\n\n It\'s amazing to have invited **so many people**, you really are a **huge fan** of __Bottle in the Sea__ and we **thank you for your loyalty** ❤', null, null, 0x2f3136, null);
        }
        return interaction.reply({ content: "", embeds: [embed], ephemeral: true });
    },
};