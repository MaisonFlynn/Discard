let deck;

function Deck() {
    deck = [
        '2♠', '3♠', '4♠', '5♠', '6♠', '7♠', '8♠', '9♠', '10♠', 'J♠', 'Q♠', 'K♠', 'A♠',
        '2♥', '3♥', '4♥', '5♥', '6♥', '7♥', '8♥', '9♥', '10♥', 'J♥', 'Q♥', 'K♥', 'A♥',
        '2♣', '3♣', '4♣', '5♣', '6♣', '7♣', '8♣', '9♣', '10♣', 'J♣', 'Q♣', 'K♣', 'A♣',
        '2♦', '3♦', '4♦', '5♦', '6♦', '7♦', '8♦', '9♦', '10♦', 'J♦', 'Q♦', 'K♦', 'A♦'
    ];

    shuffle(deck);
    return deck;
}

// Value
const X = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
    'J': 10, 'Q': 10, 'K': 10, 'A': 11
};

// Fisher-Yates Shuffle
function shuffle(deck) {
    const seed = Date.now();
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor((Math.random() * seed) % (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

function deal() {
    if (!deck || deck.length < 2) {
        Deck();
    }

    return [deck.pop(), deck.pop()];
}

module.exports = { Deck, shuffle, deal, X };