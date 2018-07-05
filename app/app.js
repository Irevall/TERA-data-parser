const Koa = require('koa');
const Router = require('koa-router');
const Serve = require('koa-static');
const Sqlite = require('sqlite');

const app = new Koa();
const router = new Router();

app.use(Serve('../html'));

router.get('/', async (ctx) => {
    ctx.body = await deliverHTML(false);
});

router.get('/show-alts', async (ctx) => {
    ctx.body = await deliverHTML(true);
    ctx.response.status = 200;
});

router.put('/:id/:column/:data', async (ctx) => {
    console.log(ctx);
    const answer = await updateDB(ctx.params);
    ctx.response.status = answer.status;
    ctx.response.message = answer.message;
});

app.use(router.routes());

app.listen(8080, () => {
    console.log('Server running on https://localhost:8080')
});

function logAndExit(error) {
    console.log(error);
    process.exit();
}

function dungeonsScore(score, type) {
    let html = '';
    if (score === '0') {
        html += 'Never completed';
    } else if (type === 'Mystic') {
        html += 'Mystic score!';
    } else if (type === 'Priest') {
        html += 'Priest score!';
    } else {
        let dmg = score.split(' ');
        html += `${(dmg[0] / (10 ** 6)).toFixed(3)}M ${dmg[1]}`;
    }
    // if (/party/.exec(data) !== null) {
    //     let x = data.split(' ');
    //     let number = x[2].replace(/,/g, '');
    //     html += '<span>' + (number / (10**6)).toFixed(3) + 'M</span>&nbsp';
    //     html += x[3] + ')';
    // } else if (/Divine/.exec(data) !== null){
    //     let x = data.match(/[0-9]+[%]/g);
    //     x.forEach((element, index) => {
    //         html += '<img src="buffs/priest/buff' + (index + 1) + '.png" alt="Buff" />';
    //         html += '<span>' + element + '</span>';
    //     });
    // } else if (/Thrall/.exec(data) !== null) {
    //     let x = data.match(/[0-9]+[%]/g);
    //     x.forEach((element, index) => {
    //         html += '<img src="buffs/mystic/buff' + (index + 1) + '.png" alt="Buff" />';
    //         html += '<span>' + element + '</span>';
    //     });
    // } else {
    //     html += 'Never completed';
    // }
    return html;
}

function addRow(element, hasAlts, showAlts) {
    const date = new Date(element.lastOnline);
    let html = '<div class="row">';
    html += `<div class="name" data-sort="${element.name}"><span ${(element.main !== '') ? (`title="Main: ${element.main}"`) : ''}>${element.name}</span>${(hasAlts && !showAlts) ? '<img src="icons/arrow.png" alt="Show alts" class="arrow"/>' : ''}</div>`;
    if (element.main === '' && !showAlts) {
        html += `<div class="rank"><span>${element.rank}</span></div>`;
    } else if (showAlts) {
        html += `<div class="rank"><span>${(element.main === '' ? element.rank : 'Alt')}</span></div>`;
    }
    html += `<div class="class" data-sort="${element.class}"><span>${element.class}</span></div>`;
    html += `<div class="contribution" data-sort="${element.contrTotal}"><span><span class="contrCurrent">${element.contrCurrent}</span>(<span class="contrTotal">${element.contrTotal}</span>)</span></div>`;
    html += `<div class="last-online" data-sort="${element.lastOnline}"><span title="${('0' + date.getHours()).substr(-2)}:${('0' + date.getMinutes()).substr(-2)}">${('0' + date.getDate()).substr(-2)}/${('0' + (date.getMonth() + 1)).substr(-2)}/${('' + date.getFullYear()).substr(-2)}</span></div>`;
    html += `<div class="note" data-sort="${element.note}"><span class="empty">...</span><span class="content hidden">${element.note}</span></div>`;
    html += `<div class="dungeons"><span class="empty">...</span><div class="content hidden">${dungeonsScore(element.RKE, element.class)}</div></div>`;
    html += `<div class="dungeons"><span class="empty">...</span><div class="content hidden">${dungeonsScore(element.RRHM, element.class)}</div></div>`;
    html += `<div class="dungeons"><span class="empty">...</span><div class="content hidden">${dungeonsScore(element.TRNM, element.class)}</div></div>`;
    html += `<div class="dungeons"><span class="empty">...</span><div class="content hidden">${dungeonsScore(element.AANM, element.class)}</div></div>`;
    html += `<div class="dungeons"><span class="empty">...</span><div class="content hidden">${dungeonsScore(element.RKNM, element.class)}</div></div>`;
    if (element.main === '') {
        html += `<div>${element.discord ? '<img src="icons/discord.png" alt="Has discord" class="discord"/>' : '<img src="icons/discord.png" alt="No discord" class="discord faded"/>'}</div>`;
        html += `<div>${element.civil ? '<img src="icons/sword.png" alt="Plays civil unrest" class="civil"/>' : '<img src="icons/sword.png" alt="Doesn\'t play civil unrest" class="civil faded"/>'}</div>`;
    }
    html += '</div>';
    return html;
}

function buildHTML(data, showAlts) {
    let head = '';
    let body = '';

    head += '<link rel="stylesheet" type="text/css" href="style.css"/>';
    head += '<script src="main.js"></script>';

    body += '<main><div class="row header"><div class="name">Name</div><div class="rank">Rank</div><div class="class">Class</div><div class="contribution">Contribution</div><div class="last-online">Last online</div><div class="note">Note</div><div>RKE</div><div>RRHM</div><div>TRNM</div><div>AANM</div><div>RKNM</div><div>Discord</div><div>Civil</div></div>';

    if (showAlts === false) {
        data.forEach((element) => {
            body += '<div class="main">';
            body += ((element.alts.length === 0) ? addRow(element, false, showAlts) : addRow(element, true, showAlts));
            body += '</div>';
            body += '<div class="alts hidden">';

            element.alts.forEach((element2) => {
                body += addRow(element2, false, showAlts);

            });

            body += '</div>';
        });
    } else {
        data.forEach((element) => {
           body += addRow(element, false, showAlts);
        });
    }


    body += '</main>';
    return '<!DOCTYPE html><html><head>' + head + '</head><body>' + body + '</body></html>';
}

async function deliverHTML(showAlts) {
    const db = await Sqlite.open('data/tera.db').catch(err => logAndExit(err));
    console.log('Open DB connection.');

    let data = await db.all('select * from guild_members').catch(err => logAndExit(err));

    if (showAlts === false) {
        data = data.sort((a, b) => !!a.main - !!b.main);
        data.forEach((element) => {
            if (element.main === '') {
                element.alts = [];
            } else {
                data.find(element2 => element2.name === element.main).alts.push(element);
                data = data.filter(element3 => element3.name !== element.name);
            }
        });
    }

    const html = buildHTML(data, showAlts);
    await db.close().catch(err => logAndExit(err));
    console.log('Close DB connection.');

    return html;
}

async function updateDB(data) {
    if (!(data.column === 'discord' || data.column === 'civil')) {
        return {status: 400, message: 'You can\'t change that column.'};
    }

    if ((data.column === 'discord' || data.column === 'civil') && !(data.data == 1 || data.data == 0)) {
        return {status: 400, message: 'Wrong value for that column.'};
    }

    const db = await Sqlite.open('data/tera.db').catch(err => logAndExit(err));
    console.log('Open DB connection.');

    const isID = await db.all('SELECT * FROM guild_members WHERE name = ?', [data.id]);
    if (isID.length === 0) {
        await db.close().catch(err => logAndExit(err));
        console.log('Close DB connection.');
        return {status: 400, message: 'No such guild member.'};
    }

    let sqlQuery = 'UPDATE guild_members SET ';
    sqlQuery += data.column;
    sqlQuery += ' = ? WHERE name = ?';

    await db.run(sqlQuery, [data.data, data.id]).catch(err => logAndExit(err));

    await db.close().catch(err => logAndExit(err));
    console.log('Close DB connection.');

    return {status: 200, message: 'Accepted and fulfilled.'};
}
