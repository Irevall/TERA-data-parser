let data = [];
let fs = require('fs');

function logAndExit(error) {
    console.log(error);
    process.exit();
}

function buildHtml(data) {
    let head = '';
    let body = '';

    head += '<link rel="stylesheet" type="text/css" href="style.css"/>';
    head += '<script src="main.js"></script>';

    body += '<table><tr><th>Name</th><th>Rank</th><th>Class</th><th>Contribution</th><th>Last online</th><th>Note</th><th>RKE</th><th>RRHM</th><th>TRNM</th><th>AANM</th><th>RKNM</th><th>Discord</th><th>Civil Unrest</th></tr>';
    data.forEach((element) => {
        body += '<tr><td>';
        body += element.name;
        body += '</td><td>';
        body += element.rank;
        body += '</td><td>';
        body += element.class;
        body += '</td><td>';
        body += element.contrCurrent + '(' + element.contrTotal + ')';
        body += '</td><td>';
        body += element.lastOnline;
        body += '</td><td>';
        body += element.note;
        body += '</td><td>';
        body += element.RKE;
        body += '</td><td>';
        body += element.RRHM;
        body += '</td><td>';
        body += element.TRNM;
        body += '</td><td>';
        body += element.AANM;
        body += '</td><td>';
        body += element.RKNM;
        body += '</td><td>';
        body += element.discord ? '<input type="checkbox" value="has-discord" checked="checked">' : '<input type="checkbox" value="has-discord">';
        body += '</td><td>';
        body += element.civil ? '<input type="checkbox" value="plays-civil" checked="checked">' : '<input type="checkbox" value="plays-civil">';
        body += '</td></tr>'
    });
    body += '</table>';
    return '<!DOCTYPE html><html><head>' + head + '</head><body>' + body + '</body></html>';
}

let db = '';

async function main() {
    const sqlite = require('sqlite');

    db = await sqlite.open('data/tera.db').catch(err => logAndExit(err));
    console.log('Open DB connection.');

    const row = await db.all('select * from guild_members').catch(err => logAndExit(err));

    let fileName = '../html/index.html';
    let stream = fs.createWriteStream(fileName);
    stream.once('open', function(fd) {
        let html = buildHtml(row);
        stream.end(html);
    });

    await db.close().catch(err => logAndExit(err));
    console.log('Close DB connection.');
}

main();
