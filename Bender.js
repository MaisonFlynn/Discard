require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const idk = '$'; // Prefix

const deck = [
	'2♠️', '3♠️', '4♠️', '5♠️', '6♠️', '7♠️', '8♠️', '9♠️', '10♠️', 'J♠️', 'Q♠️', 'K♠️', 'A♠️',
  	'2♦️', '3♦️', '4♦️', '5♦️', '6♦️', '7♦️', '8♦️', '9♦️', '10♦️', 'J♦️', 'Q♦️', 'K♦️', 'A♦️',
  	'2♥️', '3♥️', '4♥️', '5♥️', '6♥️', '7♥️', '8♥️', '9♥️', '10♥️', 'J♥️', 'Q♥️', 'K♥️', 'A♥️',
  	'2♣️', '3♣️', '4♣️', '5♣️', '6♣️', '7♣️', '8♣️', '9♣️', '10♣️', 'J♣️', 'Q♣️', 'K♣️', 'A♣️'
];

// Card Value
const X = {
	'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
	'J': 10, 'Q': 10, 'K': 10, 'A': 11
};

function calc(hand) {
	let Σ = 0; // Sum
	let A = 0; // Ace

	hand.forEach(card => {
		const rank = card.slice(0, -1); // Slice Emoji (Suit)
		Σ += X[rank];
		if (rank === 'A') A += 1;
	});

	// IF Σ + A > 21 ? A == 1 : A == 11
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

function stringify(hand) {
	// Deux?
    if (hand.length > 1) {
        return hand.slice(0, -1).join(', ') + ' & ' + hand[hand.length - 1];
    }

    return hand[0]; // Un
}

client.once('ready', () => {
	console.log("Esskeetit!");
});

client.login(process.env.TOKEN);