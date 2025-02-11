const { Deck, deal } = require('../Utility/Deck');
const { calc, hand } = require('../Utility/Card');
const { Btn3, Btn4 } = require('../Utility/Butt');

async function Bet(I, P, B) {
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
    let dΣ = calc([gayme.dHand[0]]); // ONLY Dealer's 1ˢᵗ

    P.Gayme = gayme;
    await P.save();

    // IF 𝐏𝐋𝐀𝐘𝐄𝐑 𝐖𝐎𝐍?
    if (pΣ === 21) {
        dΣ = calc(gayme.dHand);
        gayme.kaput = true;

        if (dΣ === 21) { // IF pΣ & dΣ === 21, 𝐏𝐔𝐒𝐇!
            P.Bet = 0;
            await P.save();

            await I.reply({
                content: `\`\`\`ansi\n𝐃𝐄𝐀𝐋𝐄𝐑 ${dΣ}\n${hand(gayme.dHand, true)}\n\n𝐏𝐋𝐀𝐘𝐄𝐑 ${pΣ}\n${hand(gayme.pHand, true)}\n\n𝐏𝐔𝐒𝐇! =${B}₫\`\`\``,
                components: [Btn4()]
            });

            return;
        } else { // 𝐖𝐈𝐍! & 1.5x B
            P.Dong += B + (B * 1.5);
            P.Bet = 0;
            await P.save();

            await I.reply({
                content: `\`\`\`ansi\n𝐃𝐄𝐀𝐋𝐄𝐑 ${dΣ}\n${hand(gayme.dHand, true)}\n\n𝐏𝐋𝐀𝐘𝐄𝐑 ${pΣ}\n${hand(gayme.pHand, true)}\n\n\u001b[32m𝐖𝐈𝐍! +${B * 1.5}₫\u001b[0m\`\`\``,
                components: [Btn4()]
            });

            return;
        }
    }

    // Cont.
    await I.deferUpdate();
    await I.followUp({
        content: `\`\`\`ansi\n𝐃𝐄𝐀𝐋𝐄𝐑 ${dΣ}\n${hand(gayme.dHand, false)}\n\n𝐏𝐋𝐀𝐘𝐄𝐑 ${pΣ}\n${hand(gayme.pHand, true)}\`\`\``,
        components: [Btn3(pΣ, gayme.dHand)]
    });
};

async function Interac(I, P) {
    const { Deck } = require('../Utility/Deck');
    let deck = Deck();

    const gayme = P.Gayme;
    let B = P.Bet;
    let dΣ = calc([gayme.dHand[0]]); // ONLY Dealer's 1ˢᵗ

    // 𝐈𝐍𝐒𝐔𝐑𝐀𝐍𝐂𝐄
    if (I.customId === 'INSURANCE') {
        if (gayme.kaput || gayme.insured) return;

        // 𝐈𝐍𝐒𝐔𝐑𝐀𝐍𝐂𝐄 Val. 1/2 B
        const iB = Math.floor(B / 2);
        if (P.Dong < iB) {
            await I.reply({
                content: '```ansi\n\u001b[31m𝐈𝐍𝐒𝐔𝐅𝐅𝐈𝐂𝐈𝐄𝐍𝐓 ₫!\u001b[0m\n```'
            });
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

            await I.update({ // 𝐈𝐍𝐒𝐔𝐑𝐄𝐃! =₫
                content: `\`\`\`ansi\n𝐃𝐄𝐀𝐋𝐄𝐑 ${calc(gayme.dHand)}\n${hand(gayme.dHand, true)}\n\n𝐏𝐋𝐀𝐘𝐄𝐑 ${calc(gayme.pHand)}\n${hand(gayme.pHand, true)}\n\n=${iB * 2}₫\`\`\``,
                components: []
            });
        } else {
            // !Blackjack: -𝐈𝐍𝐒𝐔𝐑𝐀𝐍𝐂𝐄
            await I.update({
                content: `\`\`\`ansi\n𝐃𝐄𝐀𝐋𝐄𝐑 ${dΣ}\n${hand(gayme.dHand, false)}\n\n𝐏𝐋𝐀𝐘𝐄𝐑 ${calc(gayme.pHand)}\n${hand(gayme.pHand, true)}\n\n\u001b[31m-${iB}₫\u001b[0m\`\`\``,
                components: [Btn3(calc(gayme.pHand), gayme.pHand, gayme.dHand[0])]
            });
        }
        return;
    }

    // 𝐃𝐎𝐔𝐁𝐋𝐄 𝐃𝐎𝐖𝐍
    if (I.customId === 'DOUBLE') {
        if (gayme.kaput || !(gayme.pHand.length === 2 && (calc(gayme.pHand) === 9 || calc(gayme.pHand) === 10 || calc(gayme.pHand) === 11))) return;

        // 𝐃𝐎𝐔𝐁𝐋𝐄 𝐃𝐎𝐖𝐍 Val.
        if (P.Dong < B) {
            await I.reply({
                content: '```ansi\n\u001b[31m𝐈𝐍𝐒𝐔𝐅𝐅𝐈𝐂𝐈𝐄𝐍𝐓 ₫!\u001b[0m\n```'
            });
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
            await I.update({
                content: `\`\`\`ansi\n𝐃𝐄𝐀𝐋𝐄𝐑 ${dΣ}\n${hand(gayme.dHand, false)}\n\n𝐏𝐋𝐀𝐘𝐄𝐑 ${pΣ}\n${hand(gayme.pHand, true)}\n\n\u001b[31m𝐋𝐎𝐒𝐄! -${P.Bet}₫\u001b[0m\`\`\``,
                components: [Btn4()]
            });
        } else {
            dΣ = calc(gayme.dHand);

            // 𝐃𝐄𝐀𝐋𝐄𝐑 𝐇𝐈𝐓 >= 17
            while (dΣ < 17 || (dΣ === 17 && gayme.dHand.some(card => card.startsWith('A')))) {
                gayme.dHand.push(deck.pop());
                dΣ = calc(gayme.dHand);
            }

            let msg = '';
            if (dΣ > 21) {
                msg = `\u001b[32m𝐖𝐈𝐍! +${B}₫\u001b[0m`;
                P.Dong += B * 2;
            } else if (pΣ > dΣ) {
                msg = `\u001b[32m𝐖𝐈𝐍! +${B}₫\u001b[0m`;
                P.Dong += B * 2;
            } else if (dΣ > pΣ) {
                msg = `\u001b[31m𝐋𝐎𝐒𝐄! -${B}₫\u001b[0m`;
            } else {
                msg = `𝐏𝐔𝐒𝐇! =${B}₫`; // 𝐓𝐈𝐄?
                P.Dong += B; // =₫
            }

            gayme.kaput = true;
            P.Bet = 0;
            P.Gayme = gayme;
            await P.save();

            await I.update({
                content: `\`\`\`ansi\n𝐃𝐄𝐀𝐋𝐄𝐑 ${dΣ}\n${hand(gayme.dHand, true)}\n\n𝐏𝐋𝐀𝐘𝐄𝐑 ${pΣ}\n${hand(gayme.pHand, true)}\n\n${msg}\`\`\``,
                components: [Btn4()]
            });
        }
    }

    // 𝐇𝐈𝐓
    if (I.customId === 'HIT') {
        if (gayme.kaput) return;

        gayme.pHand.push(deck.pop());
        const pΣ = calc(gayme.pHand);

        // 𝐏𝐋𝐀𝐘𝐄𝐑 𝐁𝐔𝐒𝐓!
        if (pΣ > 21) {
            gayme.kaput = true;
            P.Bet = 0;
            P.Gayme = gayme;
            await P.save();

            await I.update({
                content: `\`\`\`ansi\n𝐃𝐄𝐀𝐋𝐄𝐑 ${dΣ}\n${hand(gayme.dHand, false)}\n\n𝐏𝐋𝐀𝐘𝐄𝐑 ${pΣ}\n${hand(gayme.pHand, true)}\n\n\u001b[31m𝐋𝐎𝐒𝐄! -${B}₫\u001b[0m\`\`\``,
                components: [Btn4()]
            });
        } else {
            P.Gayme = gayme;
            await P.save();

            await I.update({
                content: `\`\`\`ansi\n𝐃𝐄𝐀𝐋𝐄𝐑 ${dΣ}\n${hand(gayme.dHand, false)}\n\n𝐏𝐋𝐀𝐘𝐄𝐑 ${pΣ}\n${hand(gayme.pHand, true)}\`\`\``,
                components: [Btn3()]
            });
        }
    }

    // 𝐒𝐓𝐀𝐍𝐃
    if (I.customId === 'STAND') {
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
        if (dΣ > 21) {
            msg = `\u001b[32m𝐖𝐈𝐍! +${B}₫\u001b[0m`;
            P.Dong += B * 2;
        } else if (pΣ > dΣ) {
            msg = `\u001b[32m𝐖𝐈𝐍! +${B}₫\u001b[0m`;
            P.Dong += B * 2;
        } else if (dΣ > pΣ) {
            msg = `\u001b[31m𝐋𝐎𝐒𝐄! -${B}₫\u001b[0m`;
        } else {
            msg = `𝐏𝐔𝐒𝐇! =${B}₫`; // 𝐓𝐈𝐄?
            P.Dong += B;
        }

        gayme.kaput = true;
        P.Bet = 0;
        P.Gayme = gayme;
        await P.save();

        await I.update({
            content: `\`\`\`ansi\n𝐃𝐄𝐀𝐋𝐄𝐑 ${dΣ}\n${hand(gayme.dHand, true)}\n\n𝐏𝐋𝐀𝐘𝐄𝐑 ${pΣ}\n${hand(gayme.pHand, true)}\n\n${msg}\`\`\``,
            components: [Btn4()]
        });
    }
};

module.exports = { Bet, Interac };