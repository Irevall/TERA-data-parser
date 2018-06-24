const Koa = require('koa');
const Router = require('koa-router');
const Serve = require('koa-static');
const Sqlite = require('sqlite');

const app = new Koa();
const router = new Router();

app.use(Serve('../html'));

router.get('/', async (ctx) => {
    ctx.body = await deliverHTML(false, false);
});

router.get('/show-all', async (ctx) => {
    ctx.body = await deliverHTML(false, true);
    ctx.response.status = 200;
});

router.get('/sorted/:column/:way', async (ctx) => {
    ctx.body = await deliverHTML(ctx.params, true);
    ctx.response.status = 200;
});

router.put('/:id/:column/:data', async (ctx) => {
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

function dungeonsScore(data) {
    let html = '';
    if (/party/.exec(data) !== null) {
        let x = data.split(' ');
        let number = x[2].replace(/,/g, '');
        html += '<span>' + (number / (10**6)).toFixed(3) + 'M</span>&nbsp';
        html += x[3] + ')';
    } else if (/Divine/.exec(data) !== null){
        let x = data.match(/[0-9]+[%]/g);
        x.forEach((element, index) => {
            html += '<img src="buffs/priest/buff' + (index + 1) + '.png" alt="Buff" />';
            html += '<span>' + element + '</span>';
        });
    } else if (/Thrall/.exec(data) !== null) {
        let x = data.match(/[0-9]+[%]/g);
        x.forEach((element, index) => {
            html += '<img src="buffs/mystic/buff' + (index + 1) + '.png" alt="Buff" />';
            html += '<span>' + element + '</span>';
        });
    } else {
        html += data;
    }
    return html;
}

function addRow(element, hasAlts, showAlts) {
    let html = '<div class="row"><div class="name"><span ';
    html += (element.main !== '') ? ('title="Main: ' + element.main + '"') : '';
    html += '>';
    html += element.name;
    html += '</span>';
    html += (hasAlts && !showAlts) ? '<img src="icons/arrow.png" alt="Show alts" class="arrow"/>' : '';
    if (element.main === '' && !showAlts) {
        html += '</div><div class="rank"><span>';
        html += element.rank;
        html += '</span>';
    } else if (showAlts) {
        html += '</div><div class="rank"><span>';
        html += (element.main === '' ? element.rank : 'Alt');
        html += '</span>';
    }
    html += '</div><div class="class"><span>';
    html += element.class;
    html += '</div><div class="contribution"><span>';
    html += element.contrCurrent + ' (' + element.contrTotal + ')';
    html += '</div><div class="last-online"><span title="' + element.lastOnline.split(',')[1] + '">';
    html += element.lastOnline.split(',')[0];
    html += '</div><div class="note"><span class="empty">...</span><span class="content hidden">';
    html += element.note;
    html += '</span></div><div class="dungeons"><span class="empty">...</span><div class="content hidden">';
    html += dungeonsScore(element.RKE);
    html += '</div></div><div class="dungeons"><span class="empty">...</span><div class="content hidden">';
    html += dungeonsScore(element.RRHM);
    html += '</div></div><div class="dungeons"><span class="empty">...</span><div class="content hidden">';
    html += dungeonsScore(element.TRNM);
    html += '</div></div><div class="dungeons"><span class="empty">...</span><div class="content hidden">';
    html += dungeonsScore(element.AANM);
    html += '</div></div><div class="dungeons"><span class="empty">...</span><div class="content hidden">';
    html += dungeonsScore(element.RKNM);
    html += '</div>';

    if (element.main === '') {
        html += '</div><div class="misc">';
        html += element.discord ? '<img src="icons/discord.png" alt="Has discord" class="discord"/>' : '<img src="icons/discord.png" alt="No discord" class="discord faded"/>';
        html += element.civil ? '<img src="icons/sword.png" alt="Plays civil unrest" class="civil"/>' : '<img src="icons/sword.png" alt="Doesn\'t play civil unrest" class="civil faded"/>';
    } else if (showAlts) {
        html += '</div><div class="misc">';
    }
    html += '</div></div>';
    return html;
}

function buildHTML(data, showAlts) {
    let head = '';
    let body = '';

    head += '<link rel="stylesheet" type="text/css" href="style.css"/>';
    head += '<script src="main.js"></script>';

    body += '<main><div class="row"><div>Name</div><div>Rank</div><div>Class</div><div>Contribution</div><div>Last online</div><div>Note</div><div>RKE</div><div>RRHM</div><div>TRNM</div><div>AANM</div><div>RKNM</div><div>Misc</div></div>';

    if (showAlts === false) {
        data.forEach((element) => {
            body += '<div class="main">';
            // body += addRow(element, true);
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

async function deliverHTML(sort, showAlts) {
    const db = await Sqlite.open('data/tera.db').catch(err => logAndExit(err));
    console.log('Open DB connection.');
    let data = [];

    if (!sort) {
        data = await db.all('select * from guild_members').catch(err => logAndExit(err));
    } else {
        console.log('SELECT * FROM guild_members ORDER BY ' + sort.column + ' ' + sort.way);
        console.log(sort);
        data = await db.all('SELECT * FROM guild_members ORDER BY ' + sort.column + ' ' + sort.way).catch(err => logAndExit(err));
    }


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

    if (sort !== false) {
        console.log(sort);
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
