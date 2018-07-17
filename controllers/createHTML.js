module.exports = main;

const Sqlite = require('sqlite');

function dungeonsScore(score, type) {
    let html = ' data-value="';
    if (score === '0') {
        html += '0">';
        html += '<div class="content hidden">Never completed.</div>';
    } else if (type === 'Mystic' || type === 'Priest') {
        let buffs = score.split(', ');
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

    if (score === '0') {
        html += '<span class="empty"><img src="icons/not-completed.svg"/></span>';
    } else {
        html += '<span class="empty"><img src="icons/completed.svg"/></span>';
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
    html += `<div class="contribution" data-value="${element.contrTotal}"><span><span class="contrTotal">${element.contrTotal}</span>(+<span class="contrCurrent">${element.contrCurrent}</span>)</span></div>`;
    html += `<div class="last-online" data-value="${element.lastOnline}"><span title="${('0' + date.getHours()).substr(-2)}:${('0' + date.getMinutes()).substr(-2)}">${('0' + date.getDate()).substr(-2)}/${('0' + (date.getMonth() + 1)).substr(-2)}/${('' + date.getFullYear()).substr(-2)}</span></div>`;
    html += `<div class="note" data-value="${element.note}"><span class="empty">...</span><span class="content hidden">${element.note}</span></div>`;
    html += `<div class="dungeons rke"${dungeonsScore(element.RKE, element.class)}</div>`;
    html += `<div class="dungeons rrhm"${dungeonsScore(element.RRHM, element.class)}</div>`;
    html += `<div class="dungeons trnm"${dungeonsScore(element.TRNM, element.class)}</div>`;
    html += `<div class="dungeons aanm"${dungeonsScore(element.AANM, element.class)}</div>`;
    html += `<div class="dungeons rknm"${dungeonsScore(element.RKNM, element.class)}</div>`;
    if (element.main === '' || element.main === 'true') {
        html += `<div class="discord" data-value="${element.discord ? '1"><img src="icons/discord.png" alt="Has discord"/>' : '0"><img src="icons/discord.png" alt="No discord" class="faded"/>'}</div>`;
        html += `<div class="civil" data-value="${element.civil ? '1"><img src="icons/sword.png" alt="Plays civil unrest"/>' : '0"><img src="icons/sword.png" alt="Doesn\'t play civil unrest" class="faded"/>'}</div>`;
    } else {
        html += '<div class="discord" data-value="-1"></div><div class="civil" data-value="-1"></div>';
    }
    html += '</div>';
    return html;
}

function buildHTML(data) {
    let head = '';
    let body = '';

    head += '<link rel="stylesheet" type="text/css" href="style.css"/>';
    head += '<script src="main.js"></script>';

    body += '<nav><span class="alter">Show/hide alts</span><span class="search">Search: <input type="text"/></span><span>Filter:</span> <div>' +
        '<ul class="dropdown">' +
        '<li class="option"><span>None</span></li>' +
        '<li class="with-dropdown">' +
        '<span>Rank</span>' +
        '<div>' +
        '<ul class="dropdown2">' +
        '<li class="option" data-category="rank"><span>Alt</span></li>' +
        '<li class="option" data-category="rank"><span>Daikatana</span></li>' +
        '<li class="option" data-category="rank"><span>Emperor</span></li>' +
        '<li class="option" data-category="rank"><span>Excused</span></li>' +
        '<li class="option" data-category="rank"><span>Ronin</span></li>' +
        '<li class="option" data-category="rank"><span>Samurai</span></li>' +
        '<li class="option" data-category="rank"><span>Shogun</span></li>' +
        '</ul>' +
        '</div>' +
        '</li>' +
        '<li class="with-dropdown">' +
        '<span>Class</span>' +
        '<div>' +
        '<ul class="dropdown2">' +
        '<li class="option" data-category="class"><span>Archer</span></li>' +
        '<li class="option" data-category="class"><span>Berserker</span></li>' +
        '<li class="option" data-category="class"><span>Gunner</span></li>' +
        '<li class="option" data-category="class"><span>Lancer</span></li>' +
        '<li class="option" data-category="class"><span>Mystic</span></li>' +
        '<li class="option" data-category="class"><span>Priest</span></li>' +
        '<li class="option" data-category="class"><span>Slayer</span></li>' +
        '<li class="option" data-category="class"><span>Sorcerer</span></li>' +
        '<li class="option" data-category="class"><span>Warrior</span></li>' +
        '</ul>' +
        '</div>' +
        '</li>' +
        '<li class="with-dropdown">' +
        '<span>Type</span>' +
        '<div>' +
        '<ul class="dropdown2">' +
        '<li class="option" data-category="type"><span>DMG</span></li>' +
        '<li class="option" data-category="type"><span>Buff</span></li>' +
        '</ul>' +
        '</div>' +
        '</li>' +
        '<li class="option"><span>Discord</span></li>' +
        '<li class="option"><span>Civil</span></li>' +
        '</ul>' +
        '</div></nav>';
    body += '<main><div class="header"><div class="name">Name</div><div class="class">Class</div><div class="rank">Rank</div><div class="contribution">Contribution</div><div class="last-online">Last online</div><div class="note">Note</div><div class="rke">RKE</div><div class="rrhm">RRHM</div><div class="trnm">TRNM</div><div class="aanm">AANM</div><div class="rknm">RKNM</div><div class="discord">Discord</div><div class="civil">Civil</div></div><hr/>';


    data.forEach((element) => {
        body += addRow(element);
    });


    body += '</main>';
    return '<!DOCTYPE html><html><head>' + head + '</head><body>' + body + '</body></html>';
}

async function main() {
    const db = await Sqlite.open('./database/tera.db').catch((err) => {
        return {status: 500, message: 'Database error.'};
    });

    let data = await db.all('select * from guild_members').catch(err => logAndExit(err));

    const html = buildHTML(data);

    await db.close().catch((err) => {
        return {status: 500, message: 'Database error.'};
    });

    return {status: 200, message: 'Success', body: html};
}
