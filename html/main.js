let sorted = false;

// make it fetch
function sendRequest(method, url) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.send();
}

function sortAltsHidden(column) {
    if (column === 'note') {
        return false;
    }

    let mainList = Array.from(document.querySelectorAll('.row'));
    mainList.sort((a, b) => {
        if (column === sorted) {
            b = [a, a = b][0];
        }
        let aValue = a.querySelector(`.${column}`).dataset.value;
        let bValue = b.querySelector(`.${column}`).dataset.value;
        if (aValue === bValue) {
            return a.querySelector('.name').dataset.value.localeCompare(b.querySelector('.name').dataset.value);
        } else if (column === 'name' || column === 'rank' || column === 'class') {
            return aValue.localeCompare(bValue);
        } else {
            return bValue - aValue;
        }
    });

    if (column === sorted) {
        sorted = false;
    } else {
        sorted = column;
    }

    mainList.forEach((element) => {
        document.querySelector('main').appendChild(element);
    });
}

function sortListener() {
    document.querySelector('.header').querySelectorAll('div').forEach((element) => {
        element.addEventListener('click', () => {
            sortAltsHidden(element.classList.value);
            altsAfterMains();
        });
    })
}

function altsAfterMains() {
    const alts = document.querySelectorAll('.alt');
    const mains = document.querySelectorAll('.main');

    alts.forEach((alt) => {
        let mainIndex = 0;
        mains.forEach((main, index) => {
            if (main.querySelector('.name').dataset.value === alt.querySelector('.rank').dataset.main) {
                mainIndex = index;
            }
        });
        document.querySelector('main').insertBefore(alt, document.querySelectorAll('.main')[mainIndex + 1]);
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
                console.log(element.querySelector('.name').dataset.value);
                document.querySelectorAll('.alt').forEach((alt) => {
                   if (element.querySelector('.name').dataset.value === alt.querySelector('.rank').dataset.main) {
                       if (alt.classList.contains('hidden') !== false) {
                           alt.classList.remove('hidden');
                           element.querySelector('.arrow').classList.add('down');
                       } else {
                           alt.classList.add('hidden');
                           element.querySelector('.arrow').classList.remove('down');
                       }
                       console.log(alt);
                   }
                });
            });
        }
    });
}


function hiddenElements() {
    document.querySelectorAll('.row').forEach((element, index) => {

        element.querySelectorAll('.dungeons').forEach((element2, index2) => {
            element2.addEventListener('click', () => {
                document.querySelectorAll('.row').forEach((element3) => {
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
    altsAfterMains();
    sortListener();
    miscChange();
    hiddenAlts();
    hiddenElements();
});