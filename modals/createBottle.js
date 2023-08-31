const bottle = require("../utils/bottleAction");

module.exports = {
    name: 'createBottle',
    async execute(interaction) {

        if (global.semaphore.includes(interaction.user.id)) {
            return await interaction.reply({ content: 'You already have a bottle being created!', ephemeral: true });
        }

        try {

            global.semaphore.push(interaction.user.id);

            const content = interaction.fields.getTextInputValue('textBottle');
            if (content.trim() === '') {
                return await interaction.reply({ content: "The message cannot be empty.", ephemeral: true });
            }

            const sender = interaction.member;

            await interaction.reply({ content: 'Your bottle has been sent.', ephemeral: true });

            try {
                await bottle.create(interaction.guild, sender.id, content, 0);
            } catch (e) {
                console.log(e);
            }

        } finally {
            global.semaphore = global.semaphore.filter(item => item !== interaction.user.id);
        }
    },
};