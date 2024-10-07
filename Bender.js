require('dotenv').config(); // |_・)

const { Client, GatewayIntentBits, MessageActionRow, MessageButton, ButtonStyle } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions
    ]
});

const pree = '$'; // Prefix

const deck = [
	'2♠️', '3♠️', '4♠️', '5♠️', '6♠️', '7♠️', '8♠️', '9♠️', '10♠️', 'J♠️', 'Q♠️', 'K♠️', 'A♠️',
	'2♥️', '3♥️', '4♥️', '5♥️', '6♥️', '7♥️', '8♥️', '9♥️', '10♥️', 'J♥️', 'Q♥️', 'K♥️', 'A♥️',
  	'2♣️', '3♣️', '4♣️', '5♣️', '6♣️', '7♣️', '8♣️', '9♣️', '10♣️', 'J♣️', 'Q♣️', 'K♣️', 'A♣️',
  	'2♦️', '3♦️', '4♦️', '5♦️', '6♦️', '7♦️', '8♦️', '9♦️', '10♦️', 'J♦️', 'Q♦️', 'K♦️', 'A♦️'
];

// Value
const X = {
	'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
	'J': 10, 'Q': 10, 'K': 10, 'A': 11
};

function calc(hand) {
	let Σ = 0; // Sum
	let A = 0; // Ace

	hand.forEach(card => {
		const rank = card.slice(0, card.length - 2).trim(); // ˋˏ✂┈┈┈┈ Emoji (Suit)
		Σ += X[rank];
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
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    return deck;
}

function deal() {
	const shuffled = shuffle([...deck]);

	return [shuffled.pop(), shuffled.pop()]; // "𝘐 𝘤𝘰𝘶𝘯𝘵 𝘵𝘸𝘰 𝘤𝘢𝘳𝘥𝘴, ..."
}

// Face-up
function missionarii(rank, suit) {
    return [
        `┌─────────┐`,
        `│ ${rank}${rank.length === 1 ? ' ' : ''}      │`,
        `│         │`,
        `│    ${suit}    │`,
        `│         │`,
        `│  ${rank.length === 1 ? '     ' : '    '}${rank} │`,
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

function stringify(hand) {
	// Deux?
    if (hand.length > 1) {
        return hand.slice(0, -1).join(', ') + ' & ' + hand[hand.length - 1];
    }
    return hand[0]; // Un
}

function btn() {
	return new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setCustomId('HIT')
				.setLabel('𝐇𝐈𝐓')
				.setStyle(ButtonStyle.Primary),
			new MessageButton()
				.setCustomId('STAND')
				.setLabel('𝐒𝐓𝐀𝐍𝐃')
				.setStyle(ButtonStyle.Secondary)
		);
}

let gayme = {
	pHand: [],
	dHand: [],
	kaput: false
};

// Test
function test() {
	const dHand = deal();
    const pHand = deal();

	const pΣ = calc(pHand);
    const dΣ = calc([dHand[0]]); // ONLY Dealer's 1ˢᵗ

	console.log("𝐃𝐄𝐀𝐋𝐄𝐑", dHand, dΣ);
	console.log(handii(dHand, false)); // HIDE Dealer's 2ⁿᵈ

    console.log("𝐏𝐋𝐀𝐘𝐄𝐑", pHand, pΣ);
	console.log(handii(pHand, true));
}

client.once('ready', () => {
	console.log("Esskeetit!");
	// test();
});

client.on('messageCreate', async message => {
	if (message.author.bot) return;

	// S
	if (message.content.toUpperCase() === `${pree}S`) {
		gayme = {
			pHand: deal(),
			dHand: deal(),
			kaput: false
		};

		const pΣ = calc(gayme.pHand);
		const dΣ = calc([gayme.dHand[0]]); // ONLY Dealer's 1ˢᵗ

		// Innit?
		await message.channel.send({
            content: `𝐃𝐄𝐀𝐋𝐄𝐑\n${handii(gayme.dHand, false)}\n\n𝐏𝐋𝐀𝐘𝐄𝐑\n${handii(gayme.pHand, true)}`,
            components: [btn()]
        });
	}
});

client.on('interactionCreate', async interac => {
	if (!interac.isButton()) return;

	// 𝐇𝐈𝐓
	if (interac.customId === 'HIT') {
		if (gayme.kaput) return interac.reply('$S');

		gayme.pHand.push(deck.pop());
		const pΣ = calc(gayme.pHand);

		await interac.update({
			content: `𝐃𝐄𝐀𝐋𝐄𝐑\n${handii(gayme.dHand, false)}\n\n𝐏𝐋𝐀𝐘𝐄𝐑\n${handii(gayme.pHand, true)}`,
            components: [btn()]
		});

		// 𝐏𝐋𝐀𝐘𝐄𝐑 𝐁𝐔𝐒𝐓!
		if (pΣ > 21) {
			gayme.kaput = true;
			await interac.followUp('𝐏𝐋𝐀𝐘𝐄𝐑 𝐁𝐔𝐒𝐓!');
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
		let msg = '';
		if (dΣ > 21) {
			msg = '𝐃𝐄𝐀𝐋𝐄𝐑 𝐁𝐔𝐒𝐓!';
		} else if (dΣ > pΣ) {
			msg = '𝐃𝐄𝐀𝐋𝐄𝐑 𝐖𝐎𝐍!';
		} else if (dΣ < pΣ) {
			msg = '𝐏𝐋𝐀𝐘𝐄𝐑 𝐖𝐎𝐍!';
		} else {
			msg = '𝐓𝐈𝐄?';
		}

		gayme.kaput = true;

		await interac.update({
			content: `𝐃𝐄𝐀𝐋𝐄𝐑\n${handii(gayme.dHand, true)}\n\n𝐏𝐋𝐀𝐘𝐄𝐑\n${handii(gayme.pHand, true)}`,
            components: []
		});

		await interac.followUp(msg);
	}
});

client.login(process.env.TOKEN);