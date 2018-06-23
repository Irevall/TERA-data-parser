let fs = require('fs');

const alts = {
    'Mazin.Kaiser': ['Fatooma', 'Kingrai', 'Meiko.Shirakii', 'Miss.Kaiser', 'Akuma.kaiser', 'Count.Kaiser', 'Grendizer.kaiser', 'Kaiser.Exo'],
    'Mini.Setesh': ['Khonsu', 'Mini.Osiris'],
    'Kawaii.grill': ['Kawaii.Bulbo', 'Yko'],
    'Nikki.Arkest': ['Lina.Arkest', 'Merrick.Arkest', 'Ruby.Arkest'],
    'Mereida': ['Lucky.Charm', 'Meneidä', 'Mirä-chän', 'Tulina'],
    'Raikira': ['Raikina', 'Roaronoa', 'Raikillua', 'Raiichuu', 'Raiki', 'Raikita'],
    'Skormy': ['Skorbe', 'Skorbulancer', 'Skorcerer', 'Skorcher', 'Skorkyrie', 'Skorlynne', 'Skornja', 'Skorpri', 'Skorpurr', 'Skorrawline', 'Skorrior', 'Skory', 'Skoryer', 'Skorynne'],
    'Suzi': ['suzyi', 'dilisorc', 'takemaballs', 'andiko', 'dilia'],
    'Prav': ['W.Prav', 'Pravler', 'G.Prav'],
    'Tiltlyn': ['Achu', 'Blanko', 'Zenyte', 'Spectral', 'Lyniph'],
    'Ällaya': ['Ariadn.e', 'Fällïna', 'Miny.a', 'Aërith'],
    'The.Blanker': ['Blanko'],
    'King.sslayer': ['Coldfiresy', 'Deadlyfiresy', 'Fireskullsy'],
    'omg.brunette': ['Exoluis_W'],
    'Morrandai': ['Faldorn', 'Allandras'],
    'Cataleä': ['Kataleïa', 'Catameia', 'Cataluïa'],
    'Lyria-chan': ['Lyirix', 'Yuraiyka', 'Tarik.Farrah', 'Lyirai', 'Lyira', 'Kan.U'],
    'Kebu': ['minikebu', 'Kebudos', 'Shawarma'],
    'A.dox': ['Molgron', 'T.Adox'],
    'Thelight': ['Ninga', 'Mr.Gazawe'],
    'Ninji': ['Ninjii.Sorc', 'Ninjiikun'],
    'No.Escape': ['Princess.Julia'],
    'Smyrnaa': ['Smyrna', 'Puntta'],
    'Csillagocska': ['Pink.Csillag', 'Hullo.Csillag', 'Csillagfeny', 'Morci.Csillag'],
    'play.doll': ['play-toy'],
    'Santa': ['Ratpatrol'],
    'Adälyn': ['Shiriaki', 'Daianoia', 'Shieraki'],
    'Rooooocket': ['Sklver'],
    'Inter.Stellar': ['Tessla'],
    'Valeryiah': ['Valandiel'],
    'Torcy': ['Yullissa', 'Skyilla', 'Paxslx', 'Deonna'],
    'Namastre': ['Name.Crush', 'Enryo', 'Namecut', 'Naslash'],
    'Emlyn': ['Eleora'],
    'Dammu': ['Sausage'],
    'Adraeel': ['Arkaeel', 'Asod', 'Darkflame.iq']
};

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

function addRow(element, hasAlts) {
    let html = '<div class="row"><div><span ';
    html += (element.main !== '') ? ('title="Main: ' + element.main + '"') : '';
    html += '>';
    html += element.name;
    html += '</span>';
    html += (hasAlts) ? '<img src="icons/arrow.png" alt="Show alts" class="arrow"/>' : '';
    html += '</div><div><span>';
    html += element.rank;
    html += '</div><div><span>';
    html += element.class;
    html += '</div><div><span>';
    html += element.contrCurrent + ' (' + element.contrTotal + ')';
    html += '</div><div><span>';
    html += element.lastOnline.split(',')[0];
    html += '</div><div class="notes"><span class="empty">...</span><span class="content hidden">';
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
    html += '</div></div><div>';
    html += element.discord ? '<img src="icons/discord-blue.png" alt="Has discord" />' : '<img src="icons/discord-grey.png" alt="No discord" />';
    html += element.civil ? '<img src="icons/sword-blue.png" alt="Plays civil unrest" />' : '<img src="icons/sword-grey.png" alt="Doesn\'t play civil unrest" />';
    html += '</div></div>';
    return html;
}

function buildHtml(data) {
    let head = '';
    let body = '';

    head += '<link rel="stylesheet" type="text/css" href="style.css"/>';
    head += '<script src="main.js"></script>';

    body += '<main><div class="row"><div>Name</div><div>Rank</div><div>Class</div><div>Contribution</div><div>Last online</div><div>Note</div><div>RKE</div><div>RRHM</div><div>TRNM</div><div>AANM</div><div>RKNM</div><div>Misc</div></div>';

    for (let main in alts) {
        let object = data.find((element) => {return element.name === main;});
        if (object !== undefined) {
            body += '<div class="main">';
            body += addRow(object, true);
            body += '</div>';
            body += '<div class="alts hidden">';
            for (let alt in alts[main]) {
                let object2 = data.find((element) => {return element.name === alts[main][alt];});
                if (object2 !== undefined) {
                    body += addRow(object2, false);
                    data = data.filter(element => element.name !== alts[main][alt]);
                } else {
                    console.log('Couldn\'t find match for: ' + main);
                }
            }
            body += '</div>';
            data = data.filter(element => element.name !== main);
        } else {
            console.log('Couldn\'t find match for: ' + main);
        }
    }
    data.forEach(element => body += addRow(element, false));

    body += '</main>';
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
