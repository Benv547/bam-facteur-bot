const stickyDB = require("../database/sticky");

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);

        const checkSticky = async () => {
            console.log('Checking sticky messages...');

            const stickies = await stickyDB.getAllStickies();

            if (stickies !== null) {
                for (let i = 0; i < stickies.length; i++) {
                    const guild = await client.guilds.fetch(stickies[i].id_guild);
                    const channel = await guild.channels.fetch(stickies[i].id_channel);
                    const message = await channel.messages.fetch(stickies[i].id_message);
                    const lastReply = await channel.messages.fetch(stickies[i].id_lastReply);

                    // Get last message of the channel
                    const lastMessageOfChannel = await channel.messages.fetch({limit: 1});
                    // if the last message of the channel is the last message of the sticky
                    if (lastReply === null || lastMessageOfChannel.first().id !== lastReply.id) {
                        // if the last message as be posted more than 5 minutes ago from now
                        const now = new Date();
                        if (lastMessageOfChannel.first().createdTimestamp + 5 * 60 * 1000 < now.getTime()) {
                            // delete old reply
                            if (lastReply !== null) {
                                try {
                                    await lastReply.delete();
                                } catch (error) {
                                    console.error(error);
                                }
                            }

                            // send new reply
                            const newLastReply = await channel.send({
                                content: message.content,
                                embeds: message.embeds,
                                components: message.components
                            });

                            // save reply to database
                            await stickyDB.update_id_lastReply(channel.id, newLastReply.id);
                        }
                    }
                }
            }
            setTimeout(checkSticky, 1000 * 60 * 5);
        }
        checkSticky();
    },
};