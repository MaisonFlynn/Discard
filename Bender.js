require('dotenv').config(); // |_・)

const connectDB = require('./Config/DB');
const User = require('./Model/User');
const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions
    ]
});

connectDB(); // "( – ⌓ – )=3

const pree = '$'; // Prefix

let deck;

function Deck() {
    deck = [
        '2♠️', '3♠️', '4♠️', '5♠️', '6♠️', '7♠️', '8♠️', '9♠️', '10♠️', 'J♠️', 'Q♠️', 'K♠️', 'A♠️',
        '2♥️', '3♥️', '4♥️', '5♥️', '6♥️', '7♥️', '8♥️', '9♥️', '10♥️', 'J♥️', 'Q♥️', 'K♥️', 'A♥️',
        '2♣️', '3♣️', '4♣️', '5♣️', '6♣️', '7♣️', '8♣️', '9♣️', '10♣️', 'J♣️', 'Q♣️', 'K♣️', 'A♣️',
        '2♦️', '3♦️', '4♦️', '5♦️', '6♦️', '7♦️', '8♦️', '9♦️', '10♦️', 'J♦️', 'Q♦️', 'K♦️', 'A♦️'
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
		const rank = card.slice(0, card.length - 2).trim(); // ˋˏ✂┈┈┈┈ Emoji (Suit)
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
	if (!deck || deck.length < 2) Deck();

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
		const rank = card.slice(0, card.length - 2).trim();
        const suit = card.slice(-2).trim();

        return missionarii(rank, suit); // Return ASCII Card
    });

    const combination = [];
    for (let row = 0; row < 7; row++) {  // Each card has 7 rows
        combination.push(rows.map(card => card[row]).join(' '));
    }

    return combination.join('\n');
}

function btn() {
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

	// $$
	if (message.content === `${pree}$`) {
		await message.reply('```' + P.Dong + '₫```');
		return;
	}
	
	// $#
	const regex = message.content.match(/^\$(\d+)$/);
	if (regex) {
		const B = parseInt(regex[1]); // Parse 𝐁𝐄𝐓

		// 𝐁𝐄𝐓 # Val.
		if (isNaN(B) || B < 5 || B > 100 || B % 5 !== 0) {
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
			
			await message.channel.send({
				content: `\`\`\`𝐃𝐄𝐀𝐋𝐄𝐑 ${dΣ}\n${handii(gayme.dHand, false)}\n\n𝐏𝐋𝐀𝐘𝐄𝐑 ${pΣ}\n${handii(gayme.pHand, true)}\n\n𝐏𝐋𝐀𝐘𝐄𝐑 𝐖𝐎𝐍! +${B}₫\`\`\``,
				components: []
			});
			return;
		}

		// !𝐏𝐋𝐀𝐘𝐄𝐑 𝐖𝐎𝐍, Cont.
		await message.channel.send({
			content: `\`\`\`𝐃𝐄𝐀𝐋𝐄𝐑 ${dΣ}\n${handii(gayme.dHand, false)}\n\n𝐏𝐋𝐀𝐘𝐄𝐑 ${pΣ}\n${handii(gayme.pHand, true)}\`\`\``,
			components: [btn()]
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
	const B = P.Bet;
	const dΣ = calc([gayme.dHand[0]]); // ONLY Dealer's 1ˢᵗ

	// 𝐇𝐈𝐓
	if (interac.customId === 'HIT') {
		if (gayme.kaput) return interac.reply('$S');

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
		if (gayme.kaput) return interac.reply('$S');

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
            msg = `𝐏𝐔𝐒𝐇!`; // 𝐓𝐈𝐄?
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

client.login(process.env.TOKEN);