const Koa = require('koa');
const Router = require('koa-router');
const Serve = require('koa-static');
const Sqlite = require('sqlite');

const app = new Koa();
const router = new Router();

app.use(Serve('../html'));

router.get('/', async (ctx) => {
    ctx.body = await deliverHTML();
});

router.put('/:id/:column/:data', async (ctx) => {
    const answer = await updateDB(ctx.params);
    ctx.response.status = answer.status;
    ctx.response.message = answer.message;
});

app.use(router.routes());

app.listen(8999, () => {
    console.log('Server running on https://localhost:8999')
});

function logAndExit(error) {
    console.log(error);
    process.exit();
}

function dungeonsScore(score, type) {
    let html = ' data-value="';
    if (score === '0') {
        html += '0">';
        html += '<div class="content hidden">';
        html += 'Never completed';
        html += '</div>'
    } else if (type === 'Mystic' || type === 'Priest') {
        let buffs = score.split(', ');
        buffs.pop();
        let percentageSum = 0;
        let miniHTML = '';
        buffs.forEach((element) => {
           let buffName = element.split(':')[0];
           let percentage = element.split(':')[1].slice(0, -1);
           percentageSum += Number(percentage);
           miniHTML += `<div class="img-container"><img src="buffs/${(buffName.replace(/ /g, '_')).toLowerCase()}.png" alt="${buffName}" /><div>${percentage}</div></div>`;
        });
        html += `${percentageSum}">`;
        html += '<div class="content hidden">';
        html += miniHTML;
        html += '</div>'
    } else {
        const dmg = score.split(' ');
        html += `${(dmg[0] / (10 ** 3)).toFixed(0)}">`;
        html += '<div class="content hidden">';
        html += `${(dmg[0] / (10 ** 6)).toFixed(3)}M ${dmg[1]}`;
        html += '</div>'


    }
    return html;
}

function addRow(element) {
    const date = new Date(element.lastOnline);
    let html = '<div class="row';
    if (element.main === 'true' || element.main === '') {
        html += ' main';
    } else {
        html += ' alt hidden';
    }
    html += '">';
    html += `<div class="name" data-value="${element.name}"><span>${element.name}</span>${(element.main === "true") ? '<img src="icons/arrow.png" alt="Show alts" class="arrow"/>' : ''}</div>`;
    html += `<div class="class" data-value="${element.class}"><img src="icons/classes/${(element.class).toLowerCase()}.svg" alt="${element.class}" class="class"/></div>`;
    if (element.main === '' || element.main === 'true') {
        html += `<div class="rank" data-value="${element.rank}"><span>${element.rank}</span></div>`;
    } else {
        html += `<div class="rank" data-value="Alt" data-main="${element.main}"><span title="Main: ${element.main}">Alt</span></div>`;
    }
    html += `<div class="contribution" data-value="${element.contrTotal}"><span><span class="contrCurrent">${element.contrCurrent}</span>(<span class="contrTotal">${element.contrTotal}</span>)</span></div>`;
    html += `<div class="last-online" data-value="${element.lastOnline}"><span title="${('0' + date.getHours()).substr(-2)}:${('0' + date.getMinutes()).substr(-2)}">${('0' + date.getDate()).substr(-2)}/${('0' + (date.getMonth() + 1)).substr(-2)}/${('' + date.getFullYear()).substr(-2)}</span></div>`;
    html += `<div class="note" data-value="${element.note}"><span class="empty">...</span><span class="content hidden">${element.note}</span></div>`;
    html += `<div class="dungeons rke"${dungeonsScore(element.RKE, element.class)}<span class="empty">...</span></div>`;
    html += `<div class="dungeons rrhm"${dungeonsScore(element.RRHM, element.class)}<span class="empty">...</span></div>`;
    html += `<div class="dungeons trnm"${dungeonsScore(element.TRNM, element.class)}<span class="empty">...</span></div>`;
    html += `<div class="dungeons aanm"${dungeonsScore(element.AANM, element.class)}<span class="empty">...</span></div>`;
    html += `<div class="dungeons rknm"${dungeonsScore(element.RKNM, element.class)}<span class="empty">...</span></div>`;
    if (element.main === '' || element.main === 'true') {
        html += `<div class="discord">${element.discord ? '<img src="icons/discord.png" alt="Has discord"/>' : '<img src="icons/discord.png" alt="No discord" class="faded"/>'}</div>`;
        html += `<div class="civil">${element.civil ? '<img src="icons/sword.png" alt="Plays civil unrest"/>' : '<img src="icons/sword.png" alt="Doesn\'t play civil unrest" class="faded"/>'}</div>`;
    } else {
        html += '<div></div><div></div>';
    }
    html += '</div>';
    return html;
}

function buildHTML(data) {
    let head = '';
    let body = '';

    head += '<link rel="stylesheet" type="text/css" href="style.css"/>';
    head += '<script src="main.js"></script>';

    body += '<nav><span class="alter">Show/hide alts</span></nav><main><div class="header"><div class="name">Name</div><div class="class">Class</div><div class="rank">Rank</div><div class="contribution">Contribution</div><div class="last-online">Last online</div><div class="note">Note</div><div class="rke">RKE</div><div class="rrhm">RRHM</div><div class="trnm">TRNM</div><div class="aanm">AANM</div><div class="rknm">RKNM</div><div class="discord">Discord</div><div class="civil">Civil</div></div>';


    data.forEach((element) => {
        body += addRow(element);
    });


    body += '</main>';
    return '<!DOCTYPE html><html><head>' + head + '</head><body>' + body + '</body></html>';
}

async function deliverHTML() {
    const db = await Sqlite.open('data/tera.db').catch(err => logAndExit(err));
    console.log('Open DB connection.');

    let data = await db.all('select * from guild_members').catch(err => logAndExit(err));

    const html = buildHTML(data);
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
