module.exports = main;

const sqlite = require('sqlite');

async function main(data) {
    const db = await sqlite.open('./database/tera.db').catch((err) => {
        return {status: 500, message: 'Database error.'};
    });

    console.log('Open DB connection.');

    for (let main in data) {
        console.log(main);
        const result = await db.all('SELECT * FROM guild_members WHERE name = ?', [main]).catch((err) => {
            return {status: 500, message: 'Database error.'};
        });
        if (result.length === 0) {
            console.log(`Wrong main: ${main}`);
            continue;
        }

        if (data[main].length === 0) {
            console.log(`Main with no alts: ${main}`);
            continue;
        }

        await db.run('UPDATE guild_members SET main = "true" WHERE name = ?', [main]).catch((err) => {
            return {status: 500, message: 'Database error.'};
        });
        data[main].forEach(async (alt) => {
            const result2 = await db.all('SELECT * FROM guild_members WHERE name = ?', [alt]).catch((err) => {
                return {status: 500, message: 'Database error.'};
            });
            if (result2.length !== 0) {
                await db.run('UPDATE guild_members SET main = ? WHERE name = ?', [main, alt]).catch((err) => {
                    return {status: 500, message: 'Database error.'};
                });
            } else {
                console.log(`Wrong alt: ${alt}`);
            }
        });
    }

    await db.close().catch((err) => {
        return {status: 500, message: 'Database error.'};
    });

    return {status: 200, message: 'Success'};
}
