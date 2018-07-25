module.exports = main;

const sqlite = require('sqlite');
let db;

function createNewTable() {
    let sqlQuery = 'CREATE TABLE if not exists guild_members (name TEXT, main TEXT, contrCurrent NUMBER, contrTotal NUMBER, class TEXT, rank TEXT, lastOnline number, note TEXT, RKE TEXT, RRHM TEXT,' +
        'TRNM TEXT, AANM TEXT, RKNM TEXT, discord BOOLEAN, civil BOOLEAN)';

    return db.run(sqlQuery);
}

function dataToRow(row) {
    const values = {};

    for (let property1 in row) {
        if (property1 !== 'dungeons') {
            values[property1] = row[property1];
        } else {
            for (let property2 in row.dungeons) {
                if(row.dungeons[property2].completed === false) {
                    values[property2] = false;
                } else if (row.dungeons[property2].dps !== undefined) {
                    values[property2] = `${row.dungeons[property2].dps} (${row.dungeons[property2].partyPercent})`;
                } else {
                    let buffList = [];
                    for (let buff in row.dungeons[property2]) {
                        if (buff !== 'completed') {
                            buffList.push(`${buff}:${row.dungeons[property2][buff]}`);
                        }
                    }
                    values[property2] = buffList.join(', ');
                }
            }
        }
    }

    return values;
}

function addRow(row) {
    const propertyList = [];
    const valueList = [];

    for (let property in row) {
        propertyList.push(property);
        valueList.push(row[property]);
    }

    propertyList.push('discord', 'civil', 'main');
    valueList.push(false, false, '');

    return db.run('INSERT INTO guild_members (' + propertyList.join(', ') + ') VALUES(' +  propertyList.map(() => '?' ).join(', ')  +')', valueList);
}

function updateRow(row) {
    const propertyList = [];
    const valueList = [];

    for (let property in row) {
        if (property === 'name') {
            continue;
        }
        propertyList.push(property);
        valueList.push(row[property]);
    }

    valueList.push(row.name);
    return db.run(`UPDATE guild_members SET ${propertyList.join(' = ?, ')} = ? WHERE name = ?`, valueList);
}


async function main(data) {
    db = await sqlite.open('./database/tera.db').catch((err) => {
        return {status: 500, message: 'Database error.'};
    });

    await createNewTable();

    const data2 = await db.all('SELECT * FROM guild_members');

    for (let index in data2) {
        let element = data2[index];

        let corresponding = data.find((element2) => {
            return element2.name === element.name;
        });

        if (corresponding === undefined) {
            await db.run(`UPDATE guild_members SET rank = 'Guest' WHERE name = ?`, [element.name]);
        } else {
            await updateRow(dataToRow(corresponding)).catch((err) => {
                return {status: 500, message: 'Database error.'};
            });
            data = data.filter(element3 => element3 !== corresponding);
        }
    }

    for (let index in data) {
        await addRow(dataToRow(data[index])).catch((err) => {
            return {status: 500, message: 'Database error.'};
        });
    }

    await db.close().catch((err) => {
        return {status: 500, message: 'Database error.'};
    });

    return {status: 200, message: 'Success'};
}
