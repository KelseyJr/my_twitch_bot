require('dotenv').config()
const tmi = require('tmi.js');

const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);

const commands = {
    website: {
        response: 'https://spacejelly.dev'
    },
    upvote: {
        response: (user) => `User ${user} was just upvoted!`
    }
}

const client = new tmi.Client({
    connection: {
        reconnect: true
    },
	channels: [ process.env.TWITCH_CHANNEL ],
	identity: {
		username: process.env.TWITCH_BOT_USERNAME,
		password: process.env.TWITCH_OAUTH_TOKEN
	},
});

client.connect();

client.on('message', (channel, tags, message, self) => {
    const isNotBot = tags.username.toLowerCase() !== process.env.TWITCH_BOT_USERNAME
    if(!isNotBot) {
        return;
    }
    const [raw, command, argument] = message.match(regexpCommand)
    const {response} = commands[command] ||  {}
    if(typeof response === 'function') {
        client.say(channel, response(tags.username))
    } else if(typeof response === 'string') {
        client.say(channel, response)
    }
});
	