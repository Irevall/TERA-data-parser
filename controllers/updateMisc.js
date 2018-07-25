module.exports = main;

const Sqlite = require('sqlite');

async function main(data) {
    if (!(data.column === 'discord' || data.column === 'civil')) {
        return {status: 400, message: 'You can\'t change that column.'};
    }

    if ((data.column === 'discord' || data.column === 'civil') && !(data.data == 1 || data.data == 0)) {
        return {status: 400, message: 'Wrong value for that column.'};
    }

    const db = await Sqlite.open('./database/tera.db').catch((err) => {
        return {status: 500, message: 'Database error.'};
    });

    const isID = await db.all('SELECT * FROM guild_members WHERE name = ?', [data.id]);
    if (isID.length === 0) {
        await db.close().catch((err) => {
            return {status: 500, message: 'Database error.'};
        });
        return {status: 400, message: 'No such guild member.'};
    }

    let sqlQuery = 'UPDATE guild_members SET ';
    sqlQuery += data.column;
    sqlQuery += ' = ? WHERE name = ?';

    await db.run(sqlQuery, [data.data, data.id]).catch((err) => {
        return {status: 500, message: 'Database error.'};
    });

    await db.close().catch((err) => {
        return {status: 500, message: 'Database error.'};
    });

    return {status: 200, message: 'Success'};
}