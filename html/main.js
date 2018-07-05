let sorted = false;

function sendRequest(method, url) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    // xhr.onreadystatechange = function () {
    //     if(xhr.readyState === 4 && xhr.status === 200) {
    //         let doc = document.open('text/html');
    //         doc.write(xhr.responseText);
    //         doc.close();
    //     }
    // };
    xhr.send();
}

function sortAltsHidden(column) {
    if (column === 'note') {
        return false;
    }
    let originalMainList = Array.from(document.querySelectorAll('.main'));
    let mainList = Array.from(document.querySelectorAll('.main'));
    let altList = Array.from(document.querySelectorAll('.alts'));
    mainList.sort((a, b) => {
        if (column === sorted) {
            b = [a, a = b][0];
        }
        let aValue = a.querySelector(`.${column}`).dataset.sort;
        let bValue = b.querySelector(`.${column}`).dataset.sort;
        if (aValue === bValue) {
            return a.querySelector('.name').dataset.sort.localeCompare(b.querySelector('.name').dataset.sort);
        } else if (column !== 'contribution' && column !== 'last-online') {
            return aValue.localeCompare(bValue);
        } else {
            return aValue - bValue;
        }
    });

    if (column === sorted) {
        sorted = false;
    } else {
        sorted = column;
    }


    mainList.forEach((element) => {
        document.querySelector('main').appendChild(element);
        document.querySelector('main').appendChild(altList[originalMainList.findIndex((element2) => { return element2 === element })]);
    });
}

function sortListener() {
    document.querySelector('.header').querySelectorAll('div').forEach((element) => {
        element.addEventListener('click', () => { sortAltsHidden(element.classList.value) });
    })
}

function miscChange() {
    document.querySelectorAll('.main').forEach((element) => {
        const discord = element.querySelector('.discord');
        const civil = element.querySelector('.civil');
        discord.addEventListener('click', () => {
            if (discord.classList.contains('faded')) {
                sendRequest('PUT', ('/' + element.querySelector('.name').querySelector('span').innerHTML + '/discord/1'));
                discord.classList.remove('faded');
                discord.alt = 'Has discord';
            } else {
                sendRequest('PUT', ('/' + element.querySelector('.name').querySelector('span').innerHTML + '/discord/0'));
                discord.classList.add('faded');
               discord.alt = 'No discord';
            }
        });

        civil.addEventListener('click', () => {
            if (civil.classList.contains('faded')) {
                sendRequest('PUT', ('/' + element.querySelector('.name').querySelector('span').innerHTML + '/civil/1'));
                civil.classList.remove('faded');
                civil.alt = 'Plays civil unrest';
            } else {
                sendRequest('PUT', ('/' + element.querySelector('.name').querySelector('span').innerHTML + '/civil/0'));
                civil.classList.add('faded');
                civil.alt = 'Doesn\'t play civil unrest';
            }
        });
    });
}

function hiddenAlts() {
    document.querySelectorAll('.main').forEach((element) => {
        if (element.querySelector('.arrow') !== null) {
            element.querySelector('.arrow').addEventListener('click', () => {
                console.log(element);
                let corresponding = element.nextSibling;
                if (corresponding.classList.contains('hidden') !== false) {
                    corresponding.classList.remove('hidden');
                    element.querySelector('.arrow').classList.add('down');
                } else {
                    corresponding.classList.add('hidden');
                    element.querySelector('.arrow').classList.remove('down');
                }
            });
        }
    });
}


function hiddenElements() {
    document.querySelectorAll('.row').forEach((element, index) => {
        if (index === 0) {
            return false;
        }

        element.querySelectorAll('.dungeons').forEach((element2, index2) => {
            element2.addEventListener('click', () => {
                console.log(element2);
                console.log(index2);
                document.querySelectorAll('.row').forEach((element3, index3) => {
                    if (index3 === 0) {
                        return false;
                    }
                    
                    const target = element3.querySelectorAll('.dungeons')[index2];

                    if (target.querySelector('.content').classList.contains('hidden')) {
                        target.querySelector('.content').classList.remove('hidden');
                        target.querySelector('span').classList.add('hidden');
                    } else {
                        target.querySelector('.content').classList.add('hidden');
                        target.querySelector('span').classList.remove('hidden');
                    }
                });
            })
        });

        element.querySelector('.note').addEventListener('click', () => {
            document.querySelectorAll('.note').forEach((element2, index2) => {
                if (index2 === 0) {
                    return false;
                }

                const target = element2;

                if (target.querySelector('.content').classList.contains('hidden')) {
                    target.querySelector('.content').classList.remove('hidden');
                    target.querySelector('span').classList.add('hidden');
                } else {
                    target.querySelector('.content').classList.add('hidden');
                    target.querySelector('span').classList.remove('hidden');
                }
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    sortListener();
    miscChange();
    hiddenAlts();
    hiddenElements();
});



// const xhr = new XMLHttpRequest();
// xhr.open('GET', '/sorted/name/ASC', true);
// xhr.onreadystatechange = function () {
//     if(xhr.readyState === 4 && xhr.status === 200) {
//         let doc = document.open('text/html');
//         doc.write(xhr.responseText);
//         doc.close();
//     }
// };
// xhr.send();