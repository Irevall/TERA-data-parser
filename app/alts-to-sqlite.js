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


let db = '';

function logAndExit(error) {
    console.log(error);
    process.exit();
}

async function main() {
    const sqlite = require('sqlite');

    db = await sqlite.open('data/tera.db').catch(err => logAndExit(err));
    console.log('Open DB connection.');

    for (let property in alts) {
        let sql = 'UPDATE guild_members SET main = "'
        sql += property;
        sql += '" WHERE name = "';
        sql += alts[property].join('" OR name = "');
        sql += '"';
        await db.run(sql).catch(err => logAndExit(err));
    }

    await db.close().catch(err => logAndExit(err));
    console.log('Close DB connection.');
}

main();
