const {EmbedBuilder} = require("discord.js");

module.exports = {
    createBottle: async function (content, diceBearSeed, id_sticker, signature, color, id_footer) {

        const embed = new EmbedBuilder()
            .setColor(color) // Set the color of the embed from string to hex
            .setAuthor({ name: signature, iconURL: 'https://api.dicebear.com/7.x/adventurer-neutral/png?seed=' + diceBearSeed})
            .setDescription(content)
            .setTimestamp();

        return embed;
    },
    createFullEmbed: function (title, description, thumbnail, image, color, footer, timestamp = true) {
        const embed = new EmbedBuilder();
        if (title) {
            embed.setTitle(title);
        }
        if (description) {
            embed.setDescription(description);
        }
        if (thumbnail) {
            embed.setThumbnail(thumbnail);
        }
        if (image) {
            embed.setImage(image);
        }
        if (timestamp) {
            embed.setTimestamp();
        }
        if (footer) {
            embed.setFooter({ text: footer });
        }
        if (color) {
            embed.setColor(color);
        } else {
            embed.setColor(0x2f3136);
        }
        return embed;
    }
};

// inside a command, event listener, etc.
// const exampleEmbed = new EmbedBuilder()
//     .setColor(0x0099FF)
//     .setTitle('Some title')
//     .setURL('https://discord.js.org/')
//     .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
//     .setDescription('Some description here')
//     .setThumbnail('https://i.imgur.com/AfFp7pu.png')
//     .addFields(
//         { name: 'Regular field title', value: 'Some value here' },
//         { name: '\u200B', value: '\u200B' },
//         { name: 'Inline field title', value: 'Some value here', inline: true },
//         { name: 'Inline field title', value: 'Some value here', inline: true },
//     )
//     .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
//     .setImage('https://i.imgur.com/AfFp7pu.png')
//     .setTimestamp()
//     .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
//
// channel.send({ embeds: [exampleEmbed] });
