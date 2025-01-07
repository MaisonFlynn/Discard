require('dotenv').config();

const User = require('./Model/User');
const connectDB = require('./Config/DB');
const { Client, GatewayIntentBits, ActivityType, EmbedBuilder } = require('discord.js');
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
const Btns = require('./Utility/Btns');
const Claim = require('./Command/$!');
const Yap = require('./Event/Yappin\'');

const { Bet, Interac } = require('./Command/$N'); // !

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
		
		const btn = Btns(!P.Msg);

		await message.reply({ embeds: [msg], components: [btn] });
	}
});

client.on('interactionCreate', async interac => {
    if (!interac.isButton()) return;

    const id = interac.user.id;
    let P = await User.findOne({ ID: id });

    if (!P) return;

	if (interac.customId === 'MUTE') {
		P.Msg = false;
		await P.save();

		const btns = Btns(false);
		await interac.update({ components: [btns] });
	} else if (interac.customId === 'UNMUTE') {
		P.Msg = true;
		await P.save();

		const btns = Btns(true);
		await interac.update({ components: [btns] });
	} else if (interac.customId === 'LEADERBOARD') {
		const { desc } = await Leaderboard(interac.guild);

		const msg = EmbedBuilder.from(interac.message.embeds[0])
			.setDescription(desc);

		const btns = Btns(P.Msg, true);
		await interac.update({ embeds: [msg], components: [btns] });
	} else {
		await Interac(interac, P);
	}
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