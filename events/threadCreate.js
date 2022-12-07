const { suggestion } = require('../config.json');
const suggestionDB = require('../database/suggestion.js');

module.exports = {
    name: 'threadCreate',
    async execute(thread, newlyCreated) {
        if (newlyCreated) {
            if (thread.parentId === suggestion) {
                // get first message of thread
                const messages = await thread.messages.fetch();
                const message = messages.at(0);
                await suggestionDB.insertSuggestions(message.id, thread.id, thread.ownerId, message.content, false);
            }
        }
    }
};