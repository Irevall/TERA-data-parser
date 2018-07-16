module.exports = main;

const fs = require('fs');

function logAndExit(error) {
    console.log(error);
    process.exit();
}

async function main(data) {
    const sqlite = require('sqlite');

    const db = await sqlite.open('./database/tera.db').catch(err => logAndExit(err));
    console.log('Open DB connection.');

    for (let main in data) {
        console.log(main);
        const result = await db.all('SELECT * FROM guild_members WHERE name = ?', [main]).catch(err => console.log(err));
        if (result.length === 0) {
            console.log(`Wrong main: ${main}`);
            continue;
        }

        if (data[main].length === 0) {
            console.log(`Main with no alts: ${main}`);
            continue;
        }

        await db.run('UPDATE guild_members SET main = "true" WHERE name = ?', [main]).catch(err => console.log(err));
        data[main].forEach(async (alt) => {
            const result2 = await db.all('SELECT * FROM guild_members WHERE name = ?', [alt]).catch(err => console.log(err));
            if (result2.length !== 0) {
                await db.run('UPDATE guild_members SET main = ? WHERE name = ?', [main, alt]).catch(err => console.log(err));
            } else {
                console.log(`Wrong alt: ${alt}`);
            }
        });
    }

    const date = Date.now();

    fs.writeFile(`./database/backup/old_members/${date}.json`, JSON.stringify(data), function (err) {
        if (err) throw err;
        console.log('Saved!');
    });

    await db.close().catch(err => logAndExit(err));
    console.log('Close DB connection.');
}
