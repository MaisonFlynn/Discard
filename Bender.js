require('dotenv').config();

const User = require('./Model/User');
const connectDB = require('./Config/DB');
const { Client, GatewayIntentBits, ActivityType, EmbedBuilder } = require('discord.js');
const { Btn1, Btn2 } = require('./Utility/Butt');
const { Bet } = require('./Command/$N');
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
		P = new User({ ID: id }); 
		await P.save();
	}
	
	const CMD = message.content.slice(pree.length).trim();

	if (CMD === '$') {
		const shmoney = await Claim(P);

		const msg = new EmbedBuilder()
			.setColor('#2B2D31')
			.setTitle(`👋 <@${message.author.id}> \`${P.Dong.toLocaleString()}₫\``)
			.setDescription(shmoney);
		
		const btn = Btn1(!P.Msg);

		await message.reply({ embeds: [msg], components: [btn] });
	}
});

client.on('interactionCreate', async interac => {
    if (!interac.isButton() && !interac.isModalSubmit()) return;

    const id = interac.user.id;
    let P = await User.findOne({ ID: id });

    if (!P) return;

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

		const msg = EmbedBuilder.from(interac.message.embeds[0])
			.setDescription(desc);

		const btn = Btn1(P.Msg, true);
		await interac.update({ embeds: [msg], components: [btn] });
	} else if (interac.customId === 'BLACKJACK') {
        let bet = Math.floor(P.Dong / 2 / 10) * 10;

        const msg = new EmbedBuilder()
			.setColor('#2B2D31')
            .setTitle(`👋 <@${message.author.id}> \`${P.Dong.toLocaleString()}₫\``)
            .setDescription(`\`${bet}₫\``);

        const btn = Btn2();

        await interac.update({ embeds: [msg], components: [btn] });

        const filter = (interacBtn) =>
            ['DECREASE', 'INCREASE', 'CUSTOM', 'CONFIRM'].includes(interacBtn.customId) &&
            interacBtn.user.id === interac.user.id;

        const collector = interac.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async (interacBtn) => {
            if (interacBtn.customId === 'DECREASE') {
                bet = Math.max(bet - 10, 10);
            } else if (interacBtn.customId === 'INCREASE') {
                bet = Math.min(bet + 10, Math.min(P.Dong, 1000));
            } else if (interacBtn.customId === 'CUSTOM') {
                const modal = new ModalBuilder()
                    .setCustomId('MODAL')
                    .setTitle(`👋 <@${message.author.id}> \`${P.Dong.toLocaleString()}₫\``);

                const bet = new TextInputBuilder()
                    .setCustomId('BET')
                    .setLabel('?') // !
                    .setPlaceholder(`\`${bet}₫\``)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true);

                const row = new ActionRowBuilder().addComponents(bet);
                modal.addComponents(row);

                await interacBtn.showModal(modal);
                collector.stop();
                return;
            } else if (interacBtn.customId === 'CONFIRM') {
                if (bet > P.Dong) {
                    await interacBtn.reply({
                        content: '```ansi\n\u001b[31m𝐈𝐍𝐒𝐔𝐅𝐅𝐈𝐂𝐈𝐄𝐍𝐓 ₫!\u001b[0m\n```',
                        ephemeral: true,
                    });
                } else {
                    await Bet(interacBtn, P, bet);
                }
                collector.stop();
                return;
            }

            const msg = new EmbedBuilder()
				.setColor('#2B2D31')
				.setTitle(`👋 <@${message.author.id}> \`${P.Dong.toLocaleString()}₫\``)
				.setDescription(`\`${bet}₫\``);

            await interacBtn.update({ embeds: [msg], components: [Btn2()] });
        });
    } else if (interac.customId === 'REPLAY') {
        let bet = Math.floor(P.Dong / 2 / 10) * 10;

        const msg = new EmbedBuilder()
            .setColor('#2B2D31')
            .setTitle(`👋 <@${interac.user.id}> \`${P.Dong.toLocaleString()}₫\``)
            .setDescription(`\`${bet}₫\``);

        const btn = Btn2();

        await interac.update({ embeds: [msg], components: [btn] });
    }

    if (interac.isModalSubmit() && interac.customId === 'CUSTOM') {
        const bet = parseInt(interac.fields.getTextInputValue('BET'), 10);

        if (isNaN(bet) || bet < 10 || bet > 1000 || bet % 10 !== 0) {
            await interac.reply({
                content: '```ansi\n\u001b[31m𝐈𝐍𝐕𝐀𝐋𝐈𝐃 ₫!\u001b[0m\n```',
                ephemeral: true,
            });
        } else {
            const msg = new EmbedBuilder()
				.setColor('#2B2D31')
				.setTitle(`👋 <@${message.author.id}> \`${P.Dong.toLocaleString()}₫\``)
				.setDescription(`\`${bet}₫\``);

            await interac.update({ embeds: [msg], components: [Btn2()] });
        }
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