require('dotenv').config();

const User = require('./Model/User');
const connectDB = require('./Config/DB');
const { Client, GatewayIntentBits, ActivityType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
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
const Help = require('./Command/$¿');
const Claim = require('./Command/$!');
const Leaderboard = require('./Command/$#');
const Balance = require('./Command/$$');
const { Bet, Interac } = require('./Command/$N');
const Mute = require('./Command/$-');
const Unmute = require('./Command/$+');
const Yap = require('./Event/Yappin\'');

connectDB();

const pree = '$'; // Prefix

client.once('ready', () => {
	console.log("Esskeetit!");
	client.user.setActivity('Blackjack', {
		type: ActivityType.Playing,
	});
});

client.on('messageCreate', async message => {
	if (message.author.bot || !message.content.startsWith(pree)) return;

	// 𝐏𝐋𝐀𝐘𝐄𝐑
	const id = message.author.id;
	let P = await User.findOne({ ID: id });

	if (!P) { // IF !𝐏𝐋𝐀𝐘𝐄𝐑, +𝐏𝐋𝐀𝐘𝐄𝐑
		P = new User({ ID: id, Msg: true }); 
		await P.save();
	}
	
	const CMD = message.content.slice(pree.length).trim();

	if (CMD === '$') {
		const shmoney = await Claim(P);

		const msg = new EmbedBuilder()
			.setColor('#2B2D31')
			.setTitle(`👋 <@${message.author.id}> ${P.Dong.toLocaleString()}₫`)
			.setDescription(shmoney);
	
		await message.reply({ embeds: [msg], components: [row] });
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

client.on('voiceStateUpdate', async (O, N) => {
	await Yap(O, N, client);
});

process.on('uncaughtException', (err) => {
    console.error(err);
});

process.on('unhandledRejection', (err, idk) => {
    console.error(idk, err);
});

client.login(process.env.TOKEN);