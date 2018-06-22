let data = [];
let fs = require('fs');

function logAndExit(error) {
    console.log(error);
    process.exit();
}

function dungeonsScore(data) {
    let html = '';
    if (/party/.exec(data) !== null) {
        let x = data.split(' ');
        let number = x[2].replace(/,/g, '');
        html += (number / (10**6)).toFixed(1);
        html += 'M ';
        html += x[3];
        html += ')';
    } else if (/Divine/.exec(data) !== null){
        let x = data.match(/[0-9]+[%]/g);
        x.forEach((element, index) => {
            html += '<img src="buffs/priest/buff' + (index + 1) + '.png" alt="Buff" />';
            html += ' ' + element;
        });
    } else if (/Thrall/.exec(data) !== null) {
        let x = data.match(/[0-9]+[%]/g);
        x.forEach((element, index) => {
            html += '<img src="buffs/mystic/buff' + (index + 1) + '.png" alt="Buff" />';
            html += ' ' + element;
        });
    } else {
        html += data;
    }
    return html;
}

function buildHtml(data) {
    let head = '';
    let body = '';

    head += '<link rel="stylesheet" type="text/css" href="style.css"/>';
    head += '<script src="main.js"></script>';

    body += '<table><tr><th>Name</th><th>Rank</th><th>Class</th><th>Contribution</th><th>Last online</th><th>Note</th><th>RKE</th><th>RRHM</th><th>TRNM</th><th>AANM</th><th>RKNM</th><th>Misc</th></tr>';
    data.forEach((element) => {
        body += '<tr><td>';
        body += element.name;
        body += '</td><td>';
        body += element.rank;
        body += '</td><td>';
        body += element.class;
        body += '</td><td>';
        body += element.contrCurrent + ' (' + element.contrTotal + ')';
        body += '</td><td>';
        body += element.lastOnline.split(',')[0];
        body += '</td><td class="hidden"><div class="empty">...</div><div class="content">';
        body += element.note;
        body += '</div></td><td class="dungeons hidden"><div class="empty">...</div><div class="content">';
        body += dungeonsScore(element.RKE);
        body += '</div></td><td class="dungeons hidden"><div class="empty">...</div><div class="content">';
        body += dungeonsScore(element.RRHM);
        body += '</div></td><td class="dungeons hidden"><div class="empty">...</div><div class="content">';
        body += dungeonsScore(element.TRNM);
        body += '</div></td><td class="dungeons hidden"><div class="empty">...</div><div class="content">';
        body += dungeonsScore(element.AANM);
        body += '</div></td><td class="dungeons hidden"><div class="empty">...</div><div class="content">';
        body += dungeonsScore(element.RKNM);
        body += '</div></td><td>';
        body += element.discord ? '<img src="icons/discord-blue.svg" alt="Has discord" />' : '<img src="icons/discord-grey.svg" alt="No discord" />';
        body += element.civil ? '<img src="icons/sword-blue.svg" alt="Plays civil unrest" />' : '<img src="icons/sword-grey.svg" alt="Doesn\'t play civil unrest" />';
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
