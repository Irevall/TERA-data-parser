const data = [];
let fs = require('fs');

const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('data/tera.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
});

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
    let sqlQuery = 'CREATE TABLE if not exists guild_members (name TEXT, contrCurrent NUMBER, contrTotal NUMBER, class TEXT, rank TEXT, lastOnline TEXT, note TEXT, RKE TEXT, RRHM TEXT,' +
        'TRNM TEXT, AANM TEXT, RKNM TEXT, discord BOOLEAN)';

    db.serialize(() => {
        db.run(sqlQuery);
    });
}

function addRow(row) {
    const propertyList = [];
    const valueList = [];

    for (let property1 in row) {
        if (property1 !== "dungeons") {
            propertyList.push(property1);
            valueList.push(row[property1]);
        }
    }

    db.run('INSERT INTO guild_members (' + propertyList.join(', ') + ') VALUES(' +  propertyList.map(() => '?' ).join(', ')  +')', valueList, (err) => {
        if (err) {
            return console.log(err);
        }

        console.log('A row has been inserted');
    });
}

function updateRow(row) {
    const setList = [];

    for (let property1 in row) {
        if (property1 !== "dungeons" && property1 !== "name") {
            let set = property1;
            set += ' = '
            if (row[property1].length === 0) {
                set += 'NULL';
            } else if (property1 !== 'contrCurrent' && property1 !== 'contrTotal') {
                set += '"';
                set += row[property1];
                set += '"';
            } else {
                set += row[property1];
            }
            setList.push(set);
        }
    }

    db.run('UPDATE guild_members SET ' + setList.join(', ') + ' WHERE name = "' + row.name + '"', (err) => {
        if (err) {
            return console.log(err.message);
        }
    });
}

async function main() {
    let jsonAsString = await readFile();
    JSON.parse(jsonAsString).forEach((element) => {
        data.push(element);
    });

    createNewTable();

    data.forEach((element) => {
        db.all('select * from guild_members where name = "' + element.name + '"', (err, row) => {
            if (err) {
                return console.log(err);
            }

            if (row.length === 0) {
                addRow(element);
            } else if (row.length === 1) {
                updateRow(element);
            } else {
                console.log('ERROR. More than 1 row, shouldn\'t be possible');
                console.log(row);
            }

        });
    });

    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Close the database connection.');
    });
}

main();
