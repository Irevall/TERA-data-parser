const data = [];
let fs = require('fs');

let db = '';

function logAndExit(error) {
    console.log(error);
    process.exit();
}

function readFile() {
    return new Promise(resolve => {
        fs.readFile('data/tera.json', 'utf8',  function (err, data) {
            if (err) {
                return console.log(err);
            }
            resolve(data);
        });
    });
}

function createNewTable() {
    let sqlQuery = 'CREATE TABLE if not exists guild_members (name TEXT, main TEXT, contrCurrent NUMBER, contrTotal NUMBER, class TEXT, rank TEXT, lastOnline number, note TEXT, RKE TEXT, RRHM TEXT,' +
        'TRNM TEXT, AANM TEXT, RKNM TEXT, discord BOOLEAN, civil BOOLEAN)';

    return db.run(sqlQuery);
}

function addRow(row) {
    const propertyList = [];
    const valueList = [];

    for (let property1 in row) {
        if (property1 !== 'dungeons') {
            propertyList.push(property1);
            valueList.push(row[property1]);
        } else {
            for (let property2 in row.dungeons) {
                propertyList.push(property2);
                if(row.dungeons[property2].completed === false) {
                    valueList.push(false);
                } else if (row.dungeons[property2].dps !== undefined) {
                    valueList.push(`${row.dungeons[property2].dps} (${row.dungeons[property2].partyPercent})`);
                } else {
                    let buffList = '';
                    for (let buff in row.dungeons[property2]) {
                        if (buff !== 'completed') {
                            buffList += `${buff}: ${row.dungeons[property2][buff]}, `;
                        }
                    }
                    valueList.push(buffList);
                }
            }
        }
    }

    propertyList.push('discord', 'civil', 'main');
    valueList.push(false, false, '');

    return db.run('INSERT INTO guild_members (' + propertyList.join(', ') + ') VALUES(' +  propertyList.map(() => '?' ).join(', ')  +')', valueList);
}

function updateRow(row) {
    const setList = [];

    for (let property1 in row) {
        let set = '';
        if (property1 !== "dungeons" && property1 !== "name") {
            set = property1;
            set += ' = ';
            if (property1 !== 'contrCurrent' && property1 !== 'contrTotal') {
                set += '"';
                set += row[property1];
                set += '"';
            } else {
                set += row[property1];
            }
            setList.push(set);
        } else if (property1 === "dungeons") {
            for (let property2 in row.dungeons) {
                set = property2;
                set += ' = "';
                set += row.dungeons[property2];
                set += '"';
                setList.push(set);
            }
        }
    }

    return db.run('UPDATE guild_members SET ' + setList.join(', ') + ' WHERE name = "' + row.name + '"');
}

async function main() {
    const sqlite = require('sqlite');

    db = await sqlite.open('data/tera.db').catch(err => logAndExit(err));
    console.log('Open DB connection.');

    let jsonAsString = await readFile().catch(err => logAndExit(err));
    console.log('Read file');

    JSON.parse(jsonAsString).forEach((element) => {
        data.push(element);
    });

    await createNewTable();

    for (let element in data) {
        const row = await db.all('select * from guild_members where name = "' + data[element].name + '"').catch(err => logAndExit(err));
        if (row.length === 0) {
            await addRow(data[element]).catch(err => logAndExit(err));
        } else if (row.length === 1) {
            await updateRow(data[element]).catch(err => logAndExit(err));
        } else {
            console.log('ERROR. More than 1 row, shouldn\'t be possible');
            console.log(row);
        }
    }

    await db.close().catch(err => logAndExit(err));
    console.log('Close DB connection.');
}

main();
