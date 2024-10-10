require('dotenv').config(); // |_・)

const User = require('./Model/User');
const connectDB = require('./Config/DB');
const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildVoiceStates
    ]
});
const { Bet, Interac } = require('./Command/$N');
const Voice = require('./Event/Voice');

connectDB(); // "( – ⌓ – )=3

const pree = '$'; // Prefix

client.once('ready', () => {
	console.log("Esskeetit!");
	client.user.setActivity('Blackjack', { // Censored
		type: ActivityType.Playing,
	});
});

// $?, $!, $#, $$ & $<10-100/10>
client.on('messageCreate', async message => {
	if (message.author.bot || !message.content.startsWith(pree)) return;

	// 𝐏𝐋𝐀𝐘𝐄𝐑
	const id = message.author.id;
	let P = await User.findOne({ ID: id });

	if (!P) { // IF !Player, Create
		P = new User({ ID: id }); 
		await P.save();
	}
	
	// CMD
	const CMD = message.content.slice(pree.length).trim();

	if (CMD === '?') { // Help
		const Help = require('./Command/$¿');
		await Help(message);
	} else if (CMD === '!') { // Claim
        const Claim = require('./Command/$!');
        await Claim(message, P);
    } else if (CMD === '#') { // Leaderboard
		const Leaderboard = require('./Command/$#');
		await Leaderboard(message);
	} else if (CMD === '$') { // Balance
        const Balance = require('./Command/$$');
        await Balance(message, P);
    } else if (/^\d+$/.test(CMD)) { // Bet
        let B = parseInt(CMD);
        await Bet(message, P, B);
    }
});

// 𝐇𝐈𝐓, 𝐒𝐓𝐀𝐍𝐃, 𝐃𝐎𝐔𝐁𝐋𝐄 𝐃𝐎𝐖𝐍 & 𝐈𝐍𝐒𝐔𝐑𝐀𝐍𝐂𝐄
client.on('interactionCreate', async interac => {
    if (!interac.isButton()) return;

    const id = interac.user.id;
    let P = await User.findOne({ ID: id });

    if (!P) return;

    await Interac(interac, P);
});

// ▶• ılıılıılıılıılıılı. 0:69
client.on('voiceStateUpdate', async (O, N) => {
	await Voice(O, N, client);
});

// ∅🐛
process.on('uncaughtException', (err) => {
    console.error(err);
});

// ∅🐛
process.on('unhandledRejection', (err, idk) => {
    console.error(idk, err);
});

client.login(process.env.TOKEN);