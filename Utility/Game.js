// Utility/Game

const { X } = require('./Deck');

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

module.exports = { calc, handii, doggii, missionarii };