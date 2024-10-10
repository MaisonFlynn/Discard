const User = require('../Model/User');

module.exports = async function Voice(O, N, client) {
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

		// +5₫/6m ≤ 50₫ → VC
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
};