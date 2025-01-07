module.exports = async function Claim(P) {
    const rn = new Date();
    const d8 = P.Date ? new Date(P.Date) : null;

    if (d8 && (rn - d8) < 24 * 60 * 60 * 1000) {
        // Calc.
        const tiktok = 24 * 60 * 60 * 1000 - (rn - d8);
        const h = Math.floor((tiktok / (1000 * 60 * 60)) % 24);
        const m = Math.floor((tiktok / (1000 * 60)) % 60);
        const s = Math.floor((tiktok / 1000) % 60);

        // ⩇⩇:⩇⩇:⩇⩇
        const formulation = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

        return `\`\`\`ansi\n\u001b[31m${formulation}\u001b[0m\n\`\`\``;
    } else {
        P.Dong += 50;
        P.Date = rn;
        await P.save();

        return '```ansi\n\u001b[32m+50₫\u001b[0m\n```';
    }
};