require('dotenv').config(); // |_・)

const connectDB = require('./Config/DB');
const User = require('./Model/User');
const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
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

connectDB(); // "( – ⌓ – )=3

const pree = '$'; // Prefix

let deck;

function Deck() {
    deck = [
        '2♠', '3♠', '4♠', '5♠', '6♠', '7♠', '8♠', '9♠', '10♠', 'J♠', 'Q♠', 'K♠', 'A♠',
        '2♥', '3♥', '4♥', '5♥', '6♥', '7♥', '8♥', '9♥', '10♥', 'J♥', 'Q♥', 'K♥', 'A♥',
        '2♣', '3♣', '4♣', '5♣', '6♣', '7♣', '8♣', '9♣', '10♣', 'J♣', 'Q♣', 'K♣', 'A♣',
        '2♦', '3♦', '4♦', '5♦', '6♦', '7♦', '8♦', '9♦', '10♦', 'J♦', 'Q♦', 'K♦', 'A♦'
    ];
    shuffle(deck);
}

// Value
const X = {
	'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
	'J': 10, 'Q': 10, 'K': 10, 'A': 11
};

function calc(hand) {
	let Σ = 0; // Sum
	let A = 0; // Ace

	hand.forEach(card => {
		if (!card) return;
		const rank = card.slice(0, card.length - 1).trim(); // ˋˏ✂┈┈┈┈ Emoji (Suit)
		Σ += X[rank] || 0;
		if (rank === 'A') A += 1;
	});

	// Σ + A > 21 ? A == 1 : A == 11
	while (Σ > 21 && A) {
		Σ -= 10;
		A -= 1;
	}

	return Σ;
}

// Fisher-Yates Shuffle
function shuffle(deck) {
    const idk = Date.now(); // Seed
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor((Math.random() * idk) % (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

function deal() {
	if (!deck || deck.length < 2) {
		Deck();
	}
	
	return [deck.pop(), deck.pop()]; // "𝘐 𝘤𝘰𝘶𝘯𝘵 𝘵𝘸𝘰 𝘤𝘢𝘳𝘥𝘴, ..."
}

// Face-up
function missionarii(rank, suit) {
    return [
        `┌─────────┐`,
        `│ ${rank}${rank.length === 1 ? ' ' : ''}      │`,
        `│         │`,
        `│    ${suit}    │`,
        `│         │`,
        `│      ${rank.length === 1 ? ' ' : ''}${rank} │`,
        `└─────────┘`
    ];
}

// Face-down
function doggii() {
    return [
        `┌─────────┐`,
        `│░░░░░░░░░│`,
        `│░░░░░░░░░│`,
        `│░░░░░░░░░│`,
        `│░░░░░░░░░│`,
        `│░░░░░░░░░│`,
        `└─────────┘`
    ];
}

// ASCII Hand
function handii(hand, flip = false) {
    const rows = hand.map((card, index) => {
        if (index === 1 && !flip) {
            return doggii(); // Hide Dealer's 2ⁿᵈ
        }
		const rank = card.slice(0, card.length - 1);
        const suit = card.slice(-1);

        return missionarii(rank, suit); // Return ASCII Card
    });

    const combination = [];
    for (let row = 0; row < 7; row++) {  // Each card has 7 rows
        combination.push(rows.map(card => card[row]).join(' '));
    }

    return combination.join('\n');
}

function btn(pΣ, dH) {
	const row = new ActionRowBuilder()
		.addComponents(
			new ButtonBuilder()
				.setCustomId('HIT')
				.setLabel('𝐇𝐈𝐓')
				.setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
				.setCustomId('STAND')
				.setLabel('𝐒𝐓𝐀𝐍𝐃')
				.setStyle(ButtonStyle.Secondary)
		);

	if (pΣ === 9 || pΣ === 10 || pΣ === 11) {
		row.addComponents(
			new ButtonBuilder()
				.setCustomId('DOUBLE')
				.setLabel('𝐃𝐎𝐔𝐁𝐋𝐄')
				.setStyle(ButtonStyle.Danger)
		);
	}

	if (dH && Array.isArray(dH) && dH.length > 0 && dH[0].startsWith('A')) {
		row.addComponents(
			new ButtonBuilder()
				.setCustomId('INSURANCE')
				.setLabel('𝐈𝐍𝐒𝐔𝐑𝐀𝐍𝐂𝐄')
				.setStyle(ButtonStyle.Success)
		);
	}	

	return row;
}

client.once('ready', () => {
	console.log("Esskeetit!");
});

client.on('messageCreate', async message => {
	if (message.author.bot) return;

	// 𝐏𝐋𝐀𝐘𝐄𝐑
	const id = message.author.id;
	let P = await User.findOne({ ID: id });

	if (!P) { // IF !Player, Create
		P = new User({ ID: id }); 
		await P.save();
	}

	// $!
	if (message.content === `${pree}!`) {
        const rn = new Date();
        const d8 = P.Date ? new Date(P.Date) : null;

        if (d8 && (rn - d8) < 24 * 60 * 60 * 1000) {
            // Calc. ⩇⩇:⩇⩇:⩇⩇
            const tiktok = 24 * 60 * 60 * 1000 - (rn - d8);
            const h = Math.floor((tiktok / (1000 * 60 * 60)) % 24);
            const m = Math.floor((tiktok / (1000 * 60)) % 60);
            const s = Math.floor((tiktok / 1000) % 60);

            // Format ⩇⩇:⩇⩇:⩇⩇
            const formulation = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

            await message.reply(`\`\`\`ansi\n\u001b[31m${formulation}\u001b[0m\n\`\`\``);
        } else {
            P.Dong += 50;
            P.Date = rn;
            await P.save();

            await message.reply('```ansi\n\u001b[32m+50₫\u001b[0m\n```');
        }
        return;
    }

	//$'#'
	if (message.content === `${pree}#`) {
		let U = await User.find({}); // ALL User(s)
	
		// TOP 3 Dongs
		const Top5 = U.sort((a, b) => b.Dong - a.Dong).slice(0, 3);
	
		const L = await Promise.all(Top5.map(async (u, i) => {
			const m = await message.guild.members.fetch(u.ID).catch(() => null);
			let emoji;
	
			if (i === 0) emoji = '🥇'; // 1ˢᵗ
			else if (i === 1) emoji = '🥈'; // 2ⁿᵈ
			else if (i === 2) emoji = '🥉'; // 3ʳᵈ
	
			// IF !User
			if (!m) {
				return `${emoji} ${u.Dong.toLocaleString()}₫ ?`;
			}
	
			return `${emoji} ${u.Dong.toLocaleString()}₫ <@${m.id}>`;
		}));
	
		const msg = new EmbedBuilder()
			.setDescription(L.join('\n'))
			.setColor('#2B2D31');
	
		// Send Embed
		await message.reply({ embeds: [msg] });
		return;
	}
	
	// $$
	if (message.content === `${pree}$`) {
		await message.reply('```' + P.Dong + '₫```');
		return;
	}
	
	// $#
	const regex = message.content.match(/^\$(\d+)$/);
	if (regex) {
		let B = parseInt(regex[1]); // Parse 𝐁𝐄𝐓

		// 𝐁𝐄𝐓 # Val.
		if (isNaN(B) || B < 10 || B > 100 || B % 10 !== 0) {
			await message.reply('```ansi\n\u001b[31m𝐈𝐍𝐕𝐀𝐋𝐈𝐃 𝐁𝐄𝐓!\u001b[0m\n```');
			return;
		}

		// ₫ Val.
		if (P.Dong < B) {
			await message.reply('```ansi\n\u001b[31m𝐈𝐍𝐒𝐔𝐅𝐅𝐈𝐂𝐈𝐄𝐍𝐓 ₫!\u001b[0m\n```');
			return;
		}

		// -₫
		P.Dong -= B;
		P.Bet = B;
		await P.save();

		Deck();

		gayme = {
			pHand: deal(),
			dHand: deal(),
			kaput: false,
		};

		const pΣ = calc(gayme.pHand);
		const dΣ = calc([gayme.dHand[0]]); // ONLY Dealer's 1ˢᵗ

		P.Gayme = gayme;
		await P.save();

		// IF 𝐏𝐋𝐀𝐘𝐄𝐑 𝐖𝐎𝐍?
		if (pΣ === 21) {
			gayme.kaput = true;
			P.Dong += B * 2;
			P.Bet = 0;
			P.Gayme = gayme;
			await P.save();
			
			await message.reply({
				content: `\`\`\`𝐃𝐄𝐀𝐋𝐄𝐑 ${dΣ}\n${handii(gayme.dHand, false)}\n\n𝐏𝐋𝐀𝐘𝐄𝐑 ${pΣ}\n${handii(gayme.pHand, true)}\n\n𝐏𝐋𝐀𝐘𝐄𝐑 𝐖𝐎𝐍! +${B}₫\`\`\``,
				components: []
			});
			return;
		}

		// Cont.
		await message.reply({
			content: `\`\`\`𝐃𝐄𝐀𝐋𝐄𝐑 ${dΣ}\n${handii(gayme.dHand, false)}\n\n𝐏𝐋𝐀𝐘𝐄𝐑 ${pΣ}\n${handii(gayme.pHand, true)}\`\`\``,
			components: [btn(pΣ, gayme.dHand)]
		});		
	}
});

client.on('interactionCreate', async interac => {
	if (!interac.isButton()) return;

	const id = interac.user.id;

	// Fetch Player
	let P = await User.findOne({ ID: id });

	if (!P) return;

	const gayme = P.Gayme;
	let B = P.Bet;
	let dΣ = calc([gayme.dHand[0]]); // ONLY Dealer's 1ˢᵗ

	// 𝐈𝐍𝐒𝐔𝐑𝐀𝐍𝐂𝐄
	if (interac.customId === 'INSURANCE') {
        if (gayme.kaput || gayme.insured) return;

        // 𝐈𝐍𝐒𝐔𝐑𝐀𝐍𝐂𝐄 Val. 1/2 B
        const iB = Math.floor(B / 2);
        if (P.Dong < iB) {
            await interac.reply('```ansi\n\u001b[31m𝐈𝐍𝐒𝐔𝐅𝐅𝐈𝐂𝐈𝐄𝐍𝐓 ₫!\u001b[0m\n```');
            return;
        }

        // - iB
        P.Dong -= iB;
        gayme.insured = true;
        P.Gayme = gayme;
        await P.save();

        if (calc(gayme.dHand) === 21) {
            // IF dhand Blackjack ? B 2:1
            P.Dong += iB * 2;
            gayme.kaput = true;

            await interac.update({
                content: `\`\`\`𝐃𝐄𝐀𝐋𝐄𝐑 ${calc(gayme.dHand)}\n${handii(gayme.dHand, true)}\n\n𝐈𝐍𝐒𝐔𝐑𝐄𝐃! =₫\`\`\``,
                components: []
            });
        } else {
            // !Blackjack: -𝐈𝐍𝐒𝐔𝐑𝐀𝐍𝐂𝐄
            await interac.update({
                content: `\`\`\`𝐃𝐄𝐀𝐋𝐄𝐑 ${dΣ}\n${handii(gayme.dHand, false)}\n\n𝐏𝐋𝐀𝐘𝐄𝐑 ${calc(gayme.pHand)}\n${handii(gayme.pHand, true)}\n\n-${iB}₫!\`\`\``,
                components: [btn(calc(gayme.pHand), gayme.pHand, gayme.dHand[0])]
            });
        }
        return;
    }

	// 𝐃𝐎𝐔𝐁𝐋𝐄
	if (interac.customId === 'DOUBLE') {
		if (gayme.kaput || !(gayme.pHand.length === 2 && (calc(gayme.pHand) === 9 || calc(gayme.pHand) === 10 || calc(gayme.pHand) === 11))) return;

		// 𝐃𝐎𝐔𝐁𝐋𝐄 Val.
		if (P.Dong < B) {
			await message.reply('```ansi\n\u001b[31m𝐈𝐍𝐒𝐔𝐅𝐅𝐈𝐂𝐈𝐄𝐍𝐓 ₫!\u001b[0m\n```');
			return;
		}

		// - BB
		P.Dong -= B;
		P.Bet = B * 2;
		B = P.Bet;

		// + Card
		gayme.pHand.push(deck.pop());
		gayme.kaput = true;

		P.Gayme = gayme;
		await P.save();
		
		const pΣ = calc(gayme.pHand);

		// 𝐏𝐋𝐀𝐘𝐄𝐑 𝐁𝐔𝐒𝐓!
		if (pΣ > 21) {
			await interac.update({
				content: `\`\`\`𝐃𝐄𝐀𝐋𝐄𝐑 ${dΣ}\n${handii(gayme.dHand, false)}\n\n𝐏𝐋𝐀𝐘𝐄𝐑 ${pΣ}\n${handii(gayme.pHand, true)}\n\n𝐃𝐄𝐀𝐋𝐄𝐑 𝐖𝐎𝐍! -${P.Bet}₫\`\`\``,
				components: []
			});
		} else {
			dΣ = calc(gayme.dHand);

			// 𝐃𝐄𝐀𝐋𝐄𝐑 𝐇𝐈𝐓 >= 17
			while (dΣ < 17 || (dΣ === 17 && gayme.dHand.some(card => card.startsWith('A')))) {
                gayme.dHand.push(deck.pop());
                dΣ = calc(gayme.dHand);
            }

			let msg = '';
			if (dΣ > 21 || pΣ > dΣ) {
                msg = `𝐏𝐋𝐀𝐘𝐄𝐑 𝐖𝐎𝐍! +${B}₫`;
                P.Dong += B * 2;
            } else if (dΣ > pΣ) {
                msg = `𝐃𝐄𝐀𝐋𝐄𝐑 𝐖𝐎𝐍! -${B}₫`;
            } else {
                msg = `𝐏𝐔𝐒𝐇! =${B}₫`; // 𝐓𝐈𝐄?
                P.Dong += B; // =₫
            }

            gayme.kaput = true;
            P.Bet = 0;
            P.Gayme = gayme;
            await P.save();

            await interac.update({
                content: `\`\`\`𝐃𝐄𝐀𝐋𝐄𝐑 ${dΣ}\n${handii(gayme.dHand, true)}\n\n𝐏𝐋𝐀𝐘𝐄𝐑 ${pΣ}\n${handii(gayme.pHand, true)}\n\n${msg}\`\`\``,
                components: []
            });
		}
	}

	// 𝐇𝐈𝐓
	if (interac.customId === 'HIT') {
		if (gayme.kaput) return;

		gayme.pHand.push(deck.pop());
        const pΣ = calc(gayme.pHand);

		// 𝐏𝐋𝐀𝐘𝐄𝐑 𝐁𝐔𝐒𝐓!
		if (pΣ > 21) {
			gayme.kaput = true;
			P.Bet = 0;
			P.Gayme = gayme;
			await P.save();
	
			await interac.update({
				content: `\`\`\`𝐃𝐄𝐀𝐋𝐄𝐑 ${dΣ}\n${handii(gayme.dHand, false)}\n\n𝐏𝐋𝐀𝐘𝐄𝐑 ${pΣ}\n${handii(gayme.pHand, true)}\n\n𝐃𝐄𝐀𝐋𝐄𝐑 𝐖𝐎𝐍! -${B}₫\`\`\``,
				components: []
			});
		} else {
			P.Gayme = gayme;
			await P.save();

			await interac.update({
				content: `\`\`\`𝐃𝐄𝐀𝐋𝐄𝐑 ${dΣ}\n${handii(gayme.dHand, false)}\n\n𝐏𝐋𝐀𝐘𝐄𝐑 ${pΣ}\n${handii(gayme.pHand, true)}\`\`\``,
				components: [btn()]
			});
		}
	}

	// 𝐒𝐓𝐀𝐍𝐃
	if (interac.customId === 'STAND') {
		if (gayme.kaput) return;

		// 𝐃𝐄𝐀𝐋𝐄𝐑'𝐒 𝐓𝐔𝐑𝐍
		while (true) {
			let dΣ = calc(gayme.dHand);

			// "𝘚𝘰𝘧𝘵 17"
			let A = gayme.dHand.some(card => card[0] === 'A'); // Check IF Ace
			let S = (dΣ === 17 && A);

			// 𝐃𝐄𝐀𝐋𝐄𝐑 MUST 𝐇𝐈𝐓 IF < 17 || 𝘚𝘰𝘧𝘵 17
			if (dΣ >= 17 && !S) {
				break; // 𝐒𝐓𝐀𝐍𝐃 ON >= 17 (≠ 𝘚𝘰𝘧𝘵 17)
			}

			// 𝐃𝐄𝐀𝐋𝐄𝐑 DRAW
			gayme.dHand.push(deck.pop());
		}

		const dΣ = calc(gayme.dHand);
		const pΣ = calc(gayme.pHand);

		// 𝐑𝐄𝐒𝐔𝐋𝐓
		let msg = ``;
        if (dΣ > 21 || pΣ > dΣ) {
            msg = `𝐏𝐋𝐀𝐘𝐄𝐑 𝐖𝐎𝐍! +${B}₫`;
			P.Dong += B * 2;
        } else if (dΣ > pΣ) {
            msg = `𝐃𝐄𝐀𝐋𝐄𝐑 𝐖𝐎𝐍! -${B}₫`;
        } else {
            msg = `𝐏𝐔𝐒𝐇! =${B}₫`; // 𝐓𝐈𝐄?
			P.Dong += B;
        }

		gayme.kaput = true;
		P.Bet = 0;
		P.Gayme = gayme;
		await P.save();

		await interac.update({
			content: `\`\`\`𝐃𝐄𝐀𝐋𝐄𝐑 ${dΣ}\n${handii(gayme.dHand, true)}\n\n𝐏𝐋𝐀𝐘𝐄𝐑 ${pΣ}\n${handii(gayme.pHand, true)}\n\n${msg}\`\`\``,
			components: []
		});		
	}
});

// +₫ / t
client.on('voiceStateUpdate', async (O, N) => {
    const ID = N.id;

    // Fetch User
    let U = await User.findOne({ ID: ID });

    // IF !User, NEW
    if (!U) {
        U = new User({ ID: ID });
        await U.save();
    }

    // IF U → VC
    if (!O.channelId && N.channelId) {
        console.log(`${ID} → ${N.channelId}`); // Test
        // Save Time Join
        U.Time = Date.now();
        await U.save();
    }

    // IF U ← VC
    if (O.channelId && !N.channelId) {
        console.log(`${ID} ← ${O.channelId}`); // Test
        
        // Calc. Time IN VC
        const I = Date.now(); // 𝐼 t
        const t = I - U.Time; // t

		// t → m
		const tm = Math.floor(t / (1000 * 60));

		// Limit Superior = 60m
		const limsup = Math.min(tm, 60);

		// +5₫ / 6m, 50₫ / VC
        const oorah = Math.floor(limsup / 6) * 5;

        // 50₫
        const D = Math.min(oorah, 50);

        // +₫ & ''
        U.Dong += D;
        U.Time = null;
        await U.save();

        // HH:MM
        const h = Math.floor(limsup / 60);
        const m = limsup % 60;
        const formulation = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

        // Msg.
        const M = await client.users.fetch(ID);
        if (D > 0) {
            M.send(`\`\`\`+${D}₫ / ${formulation}\`\`\``);
        }
    }
});

client.login(process.env.TOKEN);