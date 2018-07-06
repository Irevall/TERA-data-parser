let db = '';
const fs = require('fs');

function readFile() {
    return new Promise(resolve => {
        fs.readFile('data/alts.json', 'utf8',  function (err, data) {
            if (err) {
                return console.log(err);
            }
            resolve(JSON.parse(data));
        });
    });
}

function logAndExit(error) {
    console.log(error);
    process.exit();
}

async function main() {
    const sqlite = require('sqlite');

    db = await sqlite.open('data/tera.db').catch(err => logAndExit(err));
    console.log('Open DB connection.');

    const x = await readFile();

    for (let main in x) {
        console.log(main);

        const result = await db.all('SELECT * FROM guild_members WHERE name = ?', [main]).catch(err => console.log(err));
        if (result.length === 0) {
            console.log(`Wrong main: ${main}`);
            continue;
        }

        if (x[main].length === 0) {
            console.log(`Main with no alts: ${main}`);
            continue;
        }

        await db.run('UPDATE guild_members SET main = "true" WHERE name = ?', [main]).catch(err => console.log(err));
        x[main].forEach(async (alt) => {
            const result2 = await db.all('SELECT * FROM guild_members WHERE name = ?', [alt]).catch(err => console.log(err));
            if (result2.length !== 0) {
                await db.run('UPDATE guild_members SET main = ? WHERE name = ?', [main, alt]).catch(err => console.log(err));
            } else {
                console.log(`Wrong alt: ${alt}`);
            }
        });
    }

    await db.close().catch(err => logAndExit(err));
    console.log('Close DB connection.');
}

main();
