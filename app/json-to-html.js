let data = [];;
let fs = require('fs');
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

function buildHtml() {
    let head = '';
    let body = '';

    head += '<link rel="stylesheet" type="text/css" href="style.css"/>';
    head += '<script src="main.js"></script>';

    body += '<table><tr><th>Name</th><th>Rank</th><th>Class</th><th>Contribution (current)</th><th>Contribution (total)</th><th>Last online</th><th>Note</th><th>RKE average</th><th>RRHM average</th><th>TRNM average</th><th>AANM average</th><th>RKNM average</th><th>Discord</th></tr>';
    data.forEach((element, index) => {
        body += '<tr><td>';
        body += element.name;
        body += '</td><td>';
        body += element.rank;
        body += '</td><td>';
        body += element.class;
        body += '</td><td>';
        body += element.contrCurrent;
        body += '</td><td>';
        body += element.contrTotal;
        body += '</td><td>';
        body += element.lastOnline;
        body += '</td><td>';
        body += element.note;
        body += '</td><td>';
        body += element.dungeons.RKE;
        body += '</td><td>';
        body += element.dungeons.RRHM;
        body += '</td><td>';
        body += element.dungeons.TRNM;
        body += '</td><td>';
        body += element.dungeons.AANM;
        body += '</td><td>';
        body += element.dungeons.RKNM;
        body += '</td><td>';
        body += element.discord ? '<input type="checkbox" value="has-discord" checked="checked">' : '<input type="checkbox" value="has-discord">';
        body += '</td></tr>'
    });
    body += '</table>';
    return '<!DOCTYPE html><html><head>' + head + '</head><body>' + body + '</body></html>';
}

async function f1() {
    let jsonAsString = await readFile();
    JSON.parse(jsonAsString).forEach((element) => {
        data.push(element);
    });
    data.forEach((element) => {
        element.discord = false;
    });
    data.sort(function(a, b){
        if(a.name < b.name) return -1;
        if(a.name > b.name) return 1;
        return 0;
    });
    let fileName = '../html/index.html';
    let stream = fs.createWriteStream(fileName);
    stream.once('open',  function(fd) {
        let html = buildHtml();
        stream.end(html);
    });
}

f1();
