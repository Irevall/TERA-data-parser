function sendRequest(method, url, ) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.send();
}

function miscChange() {
    document.querySelectorAll('.discord').forEach((element, index) => {
        element.addEventListener('click', () => {
            if (element.classList.contains('faded')) {
                sendRequest('PUT', ('/' + document.querySelectorAll('.name')[index].querySelector('span').innerHTML + '/discord/1'));
                element.classList.remove('faded');
                element.alt = 'Has discord';
            } else {
                sendRequest('PUT', ('/' + document.querySelectorAll('.name')[index].querySelector('span').innerHTML + '/discord/0'));
                element.classList.add('faded');
                element.alt = 'No discord';
            }
        });
    });

    document.querySelectorAll('.civil').forEach((element, index) => {
        element.addEventListener('click', () => {
            if (element.classList.contains('faded')) {
                sendRequest('PUT', ('/' + document.querySelectorAll('.name')[index].querySelector('span').innerHTML + '/civil/1'));
                element.classList.remove('faded');
                element.alt = 'Plays civil unrest';
            } else {
                sendRequest('PUT', ('/' + document.querySelectorAll('.name')[index].querySelector('span').innerHTML + '/civil/0'));
                element.classList.add('faded');
                element.alt = 'Doesn\'t play civil unrest';
            }
        });
    });
}

function hiddenElements() {
    document.querySelector('.row').querySelectorAll('div').forEach((element, index) => {
        if (index >= 5 && index <= 11) {
            element.addEventListener('click', () => {
                document.querySelectorAll('.row').forEach((element2, index2) => {
                    let target = '';

                    if (element2.querySelector('.rank') === null) {
                        target = element2.querySelector('div:nth-of-type(' + (index) + ')');
                    } else {
                        target = element2.querySelector('div:nth-of-type(' + (index + 1) + ')');
                    }

                    if (index2 === 0) {
                        return false;
                    } else if (target.querySelector('.content').classList.contains('hidden')) {
                        target.querySelector('.content').classList.remove('hidden');
                        target.querySelector('span').classList.add('hidden');
                    } else {
                        target.querySelector('.content').classList.add('hidden');
                        target.querySelector('span').classList.remove('hidden');
                    }
                });
            })
        }
    });

    document.querySelectorAll('.main').forEach((element, index) => {
        if (element.querySelector('.arrow') !== null) {
            element.querySelector('.arrow').addEventListener('click', () => {
                let corresponding = document.querySelectorAll('.alts')[index];
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
document.addEventListener('DOMContentLoaded', () => {
    miscChange();
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