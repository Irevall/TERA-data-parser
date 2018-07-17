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

    for (let element in data) {
        const row = dataToRow(data[element]);
        const response = await db.all('select * from guild_members where name = "' + row.name + '"').catch((err) => {
            return {status: 500, message: 'Database error.'};
        });
        if (response.length === 0) {
            await addRow(row).catch((err) => {
                return {status: 500, message: 'Database error.'};
            });
        } else if (response.length === 1) {
            await updateRow(row).catch((err) => {
                return {status: 500, message: 'Database error.'};
            });
        } else {
            console.log('ERROR. More than 1 row, shouldn\'t be possible');
            console.log(row);
        }
    }

    await db.close().catch((err) => {
        return {status: 500, message: 'Database error.'};
    });

    return {status: 200, message: 'Success'};
}
