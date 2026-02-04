require('dotenv').config();

const User = require('./Model/User');
const connectDB = require('./Config/DB');
const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const { Notification } = require('./Command/$±');
const { Leaderboard } = require('./Command/$#');
const Claim = require('./Command/$!');
const Yap = require('./Event/VoiceChat');
const { Blackjack, Modal } = require('./Command/$$');
const { Interac } = require('./Command/$N');

connectDB();

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

const pree = '$'; // Prefix

client.on('messageCreate', async (message) => {
    if (message.author.bot) {
        setTimeout(async () => {
            try {
                await message.delete();
            } catch (err) {
                console.error(`DELETE: ${err.message}`);
            }
        }, 300000); // 5 MIN
    }
});

client.once('ready', () => {
    console.log("Esskeetit!");
    client.user.setActivity('Blackjack', {
        type: ActivityType.Playing,
    });
});

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content.startsWith(pree)) return;

    // 𝐏𝐋𝐀𝐘𝐄𝐑
    const id = message.author.id;
    let P = await User.findOne({ ID: id });

    if (!P) { // IF !𝐏𝐋𝐀𝐘𝐄𝐑, +𝐏𝐋𝐀𝐘𝐄𝐑
        P = new User({ ID: id });
        await P.save();
    }

    const CMD = message.content.slice(pree.length).trim();

    if (CMD === '$') {
        await Claim(message, P)
    }
});

client.on('interactionCreate', async (interac) => {
    if (!interac.isButton() && !interac.isModalSubmit()) return;

    const id = interac.user.id;
    let P = await User.findOne({ ID: id });

    if (!P) return;

    if (interac.isButton()) {
        if (['MUTE', 'UNMUTE'].includes(interac.customId)) {
            await Notification(interac, P);
        } else if (interac.customId === 'LEADERBOARD') {
            await Leaderboard(interac, P);
        } else if (interac.customId === 'REPLAY') {
            await Blackjack(interac, P);
        } else if (interac.customId === 'BLACKJACK') {
            await Blackjack(interac, P);
        } else if (['HIT', 'STAND', 'DOUBLE', 'INSURANCE'].includes(interac.customId)) {
            await Interac(interac, P);
        }
    } else if (interac.isModalSubmit() && interac.customId === 'MODAL') {
        await Modal(interac, P);
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