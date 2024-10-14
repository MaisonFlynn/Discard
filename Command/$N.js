const { Deck, deal } = require('../Utility/Deck');
const { calc, handii } = require('../Utility/Card');
const { btn } = require('../Utility/Butt');

async function Bet(message, P, B) {
    // 𝐁𝐄𝐓 # Val.
    if (isNaN(B) || B < 10 || B > 1000 || B % 10 !== 0) {
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
    let dΣ = calc([gayme.dHand[0]]); // ONLY Dealer's 1ˢᵗ

    P.Gayme = gayme;
    await P.save();

    // IF 𝐏𝐋𝐀𝐘𝐄𝐑 𝐖𝐎𝐍?
    if (pΣ === 21) {
        dΣ = calc(gayme.dHand);

        if (dΣ === 21) { // IF pΣ & dΣ === 21, 𝐏𝐔𝐒𝐇!
            gayme.kaput = true;
            P.Bet = 0;
            await P.save();

            await message.reply({
                content: `\`\`\`ansi\n𝐃𝐄𝐀𝐋𝐄𝐑 ${dΣ}\n${handii(gayme.dHand, true)}\n\n𝐏𝐋𝐀𝐘𝐄𝐑 ${pΣ}\n${handii(gayme.pHand, true)}\n\n𝐏𝐔𝐒𝐇! =${B}₫\`\`\``,
                components: []
            });

            return;
        } else { // 𝐖𝐈𝐍! & 1.5x B
            gayme.kaput = true;
            P.Dong += B * 2.5; // 1.5x B
            P.Bet = 0;
            await P.save();

            await message.reply({
                content: `\`\`\`ansi\n𝐃𝐄𝐀𝐋𝐄𝐑 ${dΣ}\n${handii(gayme.dHand, true)}\n\n𝐏𝐋𝐀𝐘𝐄𝐑 ${pΣ}\n${handii(gayme.pHand, true)}\n\n\u001b[32m𝐖𝐈𝐍! +${B * 1.5}₫\u001b[0m\`\`\``,
                components: []
            });

            return;
        }
    }

    // Cont.
    await message.reply({
        content: `\`\`\`ansi\n𝐃𝐄𝐀𝐋𝐄𝐑 ${dΣ}\n${handii(gayme.dHand, false)}\n\n𝐏𝐋𝐀𝐘𝐄𝐑 ${pΣ}\n${handii(gayme.pHand, true)}\`\`\``,
        components: [btn(pΣ, gayme.dHand)],
        ephemeral: true
    });		
};

async function Interac(interac, P) {
    const { Deck } = require('../Utility/Deck');
    let deck = Deck();

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

            await interac.update({ // 𝐈𝐍𝐒𝐔𝐑𝐄𝐃! =₫
                content: `\`\`\`ansi\n𝐃𝐄𝐀𝐋𝐄𝐑 ${calc(gayme.dHand)}\n${handii(gayme.dHand, true)}\n\n𝐏𝐋𝐀𝐘𝐄𝐑 ${calc(gayme.pHand)}\n${handii(gayme.pHand, true)}\n\n=${iB * 2}₫\`\`\``,
                components: []
            });
        } else {
            // !Blackjack: -𝐈𝐍𝐒𝐔𝐑𝐀𝐍𝐂𝐄
            await interac.update({
                content: `\`\`\`ansi\n𝐃𝐄𝐀𝐋𝐄𝐑 ${dΣ}\n${handii(gayme.dHand, false)}\n\n𝐏𝐋𝐀𝐘𝐄𝐑 ${calc(gayme.pHand)}\n${handii(gayme.pHand, true)}\n\n\u001b[31m-${iB}₫\u001b[0m\`\`\``,
                components: [btn(calc(gayme.pHand), gayme.pHand, gayme.dHand[0])],
				ephemeral: true
            });
        }
        return;
    }

	// 𝐃𝐎𝐔𝐁𝐋𝐄 𝐃𝐎𝐖𝐍
	if (interac.customId === 'DOUBLE') {
		if (gayme.kaput || !(gayme.pHand.length === 2 && (calc(gayme.pHand) === 9 || calc(gayme.pHand) === 10 || calc(gayme.pHand) === 11))) return;

		// 𝐃𝐎𝐔𝐁𝐋𝐄 𝐃𝐎𝐖𝐍 Val.
		if (P.Dong < B) {
			await interac.reply('```ansi\n\u001b[31m𝐈𝐍𝐒𝐔𝐅𝐅𝐈𝐂𝐈𝐄𝐍𝐓 ₫!\u001b[0m\n```');
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
				content: `\`\`\`ansi\n𝐃𝐄𝐀𝐋𝐄𝐑 ${dΣ}\n${handii(gayme.dHand, false)}\n\n𝐏𝐋𝐀𝐘𝐄𝐑 ${pΣ}\n${handii(gayme.pHand, true)}\n\n\u001b[31m𝐋𝐎𝐒𝐄! -${P.Bet}₫\u001b[0m\`\`\``,
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

            await interac.update({
                content: `\`\`\`ansi\n𝐃𝐄𝐀𝐋𝐄𝐑 ${dΣ}\n${handii(gayme.dHand, true)}\n\n𝐏𝐋𝐀𝐘𝐄𝐑 ${pΣ}\n${handii(gayme.pHand, true)}\n\n${msg}\`\`\``,
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
				content: `\`\`\`ansi\n𝐃𝐄𝐀𝐋𝐄𝐑 ${dΣ}\n${handii(gayme.dHand, false)}\n\n𝐏𝐋𝐀𝐘𝐄𝐑 ${pΣ}\n${handii(gayme.pHand, true)}\n\n\u001b[31m𝐋𝐎𝐒𝐄! -${B}₫\u001b[0m\`\`\``,
				components: []
			});
		} else {
			P.Gayme = gayme;
			await P.save();

			await interac.update({
				content: `\`\`\`ansi\n𝐃𝐄𝐀𝐋𝐄𝐑 ${dΣ}\n${handii(gayme.dHand, false)}\n\n𝐏𝐋𝐀𝐘𝐄𝐑 ${pΣ}\n${handii(gayme.pHand, true)}\`\`\``,
				components: [btn()],
				ephemeral: true
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

		await interac.update({
			content: `\`\`\`ansi\n𝐃𝐄𝐀𝐋𝐄𝐑 ${dΣ}\n${handii(gayme.dHand, true)}\n\n𝐏𝐋𝐀𝐘𝐄𝐑 ${pΣ}\n${handii(gayme.pHand, true)}\n\n${msg}\`\`\``,
			components: []
		});		
	}
};

module.exports = { Bet, Interac };