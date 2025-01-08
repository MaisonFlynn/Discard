require('dotenv').config();

const User = require('./Model/User');
const connectDB = require('./Config/DB');
const { Client, GatewayIntentBits, ActivityType, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const { Btn1, Btn2 } = require('./Utility/Butt');
const { Bet, Interac } = require('./Command/$N');
const Claim = require('./Command/$!');
const Leaderboard = require('./Command/$#');
const Yap = require('./Event/Yappin\'');

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
        }, 60000); // 1 MIN
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
		const shmoney = await Claim(P);

		const msg = new EmbedBuilder()
			.setColor('#2B2D31')
			.setTitle(`👋 ${message.member ? message.member.displayName : message.author.username} \`${P.Dong.toLocaleString()}₫\``)
			.setDescription(shmoney);
		
		const btn = Btn1(P.Msg);

		await message.reply({ embeds: [msg], components: [btn] });
	}
});

client.on('interactionCreate', async (interac) => {
    if (!interac.isButton() && !interac.isModalSubmit()) return;

    const id = interac.user.id;
    let P = await User.findOne({ ID: id });

    if (!P) return;

	let bet = Math.min(Math.floor(P.Dong / 2 / 10) * 10, 1000);

    if (interac.isButton()) {
        if (interac.customId === 'MUTE') {
            P.Msg = false;
            await P.save();
            const btn = Btn1(false);
            await interac.update({ components: [btn] });
        } else if (interac.customId === 'UNMUTE') {
            P.Msg = true;
            await P.save();
            const btn = Btn1(true);
            await interac.update({ components: [btn] });
        } else if (interac.customId === 'LEADERBOARD') {
            const { desc } = await Leaderboard(interac.guild);
            const msg = EmbedBuilder.from(interac.message.embeds[0]).setDescription(desc);
            const btn = Btn1(P.Msg, true);
            await interac.update({ embeds: [msg], components: [btn] });
        } else if (interac.customId === 'REPLAY') {
			interac.customId = 'BLACKJACK';
        } 
		
		if (interac.customId === 'BLACKJACK') {
            const msg = new EmbedBuilder()
                .setColor('#2B2D31')
                .setTitle(`👋 ${interac.member ? interac.member.displayName : interac.user.username} \`${P.Dong.toLocaleString()}₫\``)
                .setDescription(`\`${bet}₫\``);

            const btn = Btn2(bet, Math.min(P.Dong, 1000), P.Dong);

            await interac.update({ embeds: [msg], components: [btn] });

            const filter = (interacBtn) =>
                ['DECREASE', 'INCREASE', 'CUSTOM', 'CONFIRM'].includes(interacBtn.customId) &&
                interacBtn.user.id === interac.user.id;

            const collector = interac.channel.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async (interacBtn) => {
				if (interacBtn.customId === 'CONFIRM') {
					collector.stop();
                    await Bet(interacBtn, P, bet);
                    return;
                }

                if (interacBtn.customId === 'DECREASE') {
                    bet = Math.max(bet - 10, 10);
                } else if (interacBtn.customId === 'INCREASE') {
                    bet = Math.min(bet + 10, Math.min(P.Dong, 1000));
                } else if (interacBtn.customId === 'CUSTOM') {
                    const modal = new ModalBuilder()
                        .setCustomId('MODAL')
                        .setTitle(`👋 ${interac.member ? interac.member.displayName : interac.user.username} ${P.Dong.toLocaleString()}₫`);

                    const input = new TextInputBuilder()
                        .setCustomId('BET')
                        .setLabel('Bet?')
                        .setPlaceholder(`${bet}₫`)
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true);

                    const row = new ActionRowBuilder().addComponents(input);
                    modal.addComponents(row);

                    await interacBtn.showModal(modal);
                    return;
                }

				const btn2 = Btn2(bet, Math.min(P.Dong, 1000), P.Dong);
                const msg2 = new EmbedBuilder()
                    .setColor('#2B2D31')
                    .setTitle(`👋 ${interac.member ? interac.member.displayName : interac.user.username} ${P.Dong.toLocaleString()}₫`)
                    .setDescription(`\`${bet}₫\``);

                await interacBtn.update({ embeds: [msg2], components: [btn2] });
            });
        } else if (['HIT', 'STAND', 'DOUBLE', 'INSURANCE'].includes(interac.customId)) {
            await Interac(interac, P);
        }
    } else if (interac.isModalSubmit() && interac.customId === 'MODAL') {
        const input = interac.fields.getTextInputValue('BET');
        const bet2 = parseInt(input, 10);

        if (isNaN(bet2) || bet2 < 10 || bet2 > 1000 || bet2 % 10 !== 0 || bet2 > P.Dong) {
            await interac.reply({
                content: '```ansi\n\u001b[31m𝐈𝐍𝐕𝐀𝐋𝐈𝐃 ₫! (𝟏𝟎-𝟏𝐊/𝟏𝟎)\u001b[0m\n```',
                ephemeral: true,
            });
            return;
        }

        bet = bet2;

        const msg = new EmbedBuilder()
            .setColor('#2B2D31')
            .setTitle(`👋 ${interac.member ? interac.member.displayName : interac.user.username} \`${P.Dong.toLocaleString()}₫\``)
            .setDescription(`\`${bet}₫\``);

		const btn = Btn2(bet, Math.min(P.Dong, 1000), P.Dong);

        await interac.update({ embeds: [msg], components: [btn] });
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