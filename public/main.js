let sorted = 'none';
let filtered = [];

// keep track when user changes alt visibility and when filtering does
let altsVisible, lastUserChoice;

function sendRequest(method, url) {
    fetch(url, {
        method: method,
    });
}

function showAll() {
    document.querySelectorAll('.row').forEach((element) => {
        if (element.classList.contains('hidden') === true) {
            element.classList.remove('hidden');
        }
    })
}

function hideAll() {
    document.querySelectorAll('.row').forEach((element) => {
        if (element.classList.contains('hidden') === false) {
            element.classList.add('hidden');
        }
    })
}

function sortColumn(column) {
    if (column === 'note') {
        return false;
    }

    let mainList = Array.from(document.querySelectorAll('.row'));

    if (column !== 'contribution') {
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
            sorted = `${column}-reverse`;
        } else {
            sorted = column;
        }
    } else {
        mainList.sort((a, b) => {
            if (sorted.includes('contr') && !sorted.includes('reverse')) {
                b = [a, a = b][0];
            }

            let aValue, bValue;
            if (!sorted.includes('contr') || sorted === 'contrTotal' || sorted === 'contrCurrent-reverse') {
                if (altsVisible !== false) {
                    aValue = a.querySelector(`.${column}`).dataset.value1;
                    bValue = b.querySelector(`.${column}`).dataset.value1;
                } else {
                    aValue = a.querySelector(`.${column}`).dataset.value3;
                    bValue = b.querySelector(`.${column}`).dataset.value3;
                }
            } else {
                if (altsVisible !== false) {
                    aValue = a.querySelector(`.${column}`).dataset.value2;
                    bValue = b.querySelector(`.${column}`).dataset.value2;
                } else {
                    aValue = a.querySelector(`.${column}`).dataset.value4;
                    bValue = b.querySelector(`.${column}`).dataset.value4;
                }
            }

            if (aValue === bValue) {
                return a.querySelector('.name').dataset.value.localeCompare(b.querySelector('.name').dataset.value);
            } else {
                return bValue - aValue;
            }
        });

        if (!sorted.includes('contr') || sorted === 'contrCurrent-reverse') {
            sorted = 'contrTotal';
        } else if (sorted === 'contrTotal') {
            sorted = 'contrTotal-reverse';
        } else if (sorted === 'contrTotal-reverse') {
            sorted = 'contrCurrent';
        } else {
            sorted = 'contrCurrent-reverse';
        }
    }

    mainList.forEach((element) => {
        document.querySelector('main').appendChild(element);
    });
}

function setContribution(elements, state) {
    if (elements.length === undefined) {
        elements = [elements];
    }

    elements.forEach((element) => {
        let contribution = element.querySelector('.contribution');
        if (state === 'combined') {
            contribution.querySelector('.contrTotal').innerHTML = contribution.dataset.value3;
            contribution.querySelector('.contrCurrent').innerHTML = contribution.dataset.value4;
        } else {
            contribution.querySelector('.contrTotal').innerHTML = contribution.dataset.value1;
            contribution.querySelector('.contrCurrent').innerHTML = contribution.dataset.value2;
        }
    });
}

function sortListener() {
    document.querySelector('.header').querySelectorAll('div').forEach((element) => {
        element.addEventListener('click', () => {
            sortColumn(element.classList.value);
            sortAltsAfterMains();
        });
    })
}

function sortAltsAfterMains() {
    if (altsVisible === true) {
        return false;
    }

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

function miscStateChange() {
    document.querySelectorAll('.main').forEach((element) => {
        const discord = element.querySelector('.discord').querySelector('img');
        const civil = element.querySelector('.civil').querySelector('img');
        discord.addEventListener('click', () => {
            if (discord.classList.contains('faded')) {
                sendRequest('PUT', ('/' + element.querySelector('.name').querySelector('span').innerHTML + '/discord/1'));
                discord.classList.remove('faded');
                discord.alt = 'Has discord';
                element.querySelector('.discord').dataset.value = 1;
            } else {
                sendRequest('PUT', ('/' + element.querySelector('.name').querySelector('span').innerHTML + '/discord/0'));
                discord.classList.add('faded');
                discord.alt = 'No discord';
                element.querySelector('.discord').dataset.value = 0;
            }
        });

        civil.addEventListener('click', () => {
            if (civil.classList.contains('faded')) {
                sendRequest('PUT', ('/' + element.querySelector('.name').querySelector('span').innerHTML + '/civil/1'));
                civil.classList.remove('faded');
                civil.alt = 'Plays civil unrest';
                element.querySelector('.civil').dataset.value = 1;
            } else {
                sendRequest('PUT', ('/' + element.querySelector('.name').querySelector('span').innerHTML + '/civil/0'));
                civil.classList.add('faded');
                civil.alt = 'Doesn\'t play civil unrest';
                element.querySelector('.civil').dataset.value = 0;
            }
        });
    });
}

function switchColumnVisibility() {
    document.querySelectorAll('.row').forEach((element) => {

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
            document.querySelectorAll('.row').forEach((element2) => {
                const target2 = element2.querySelector('.note');

                if (target2.querySelector('.content').classList.contains('hidden')) {
                    target2.querySelector('.content').classList.remove('hidden');
                    target2.querySelector('span').classList.add('hidden');
                } else {
                    target2.querySelector('.content').classList.add('hidden');
                    target2.querySelector('span').classList.remove('hidden');
                }
            });
        });
    });
}

function switchAltsVisibility() {
    document.querySelectorAll('.main').forEach((element) => {
        if (element.querySelector('.arrow') !== null) {
            element.querySelector('.arrow').addEventListener('click', () => {
                if (!element.querySelector('.arrow').classList.contains('down')) {
                    setContribution(element, 'individual');
                } else {
                    setContribution(element, 'combined');
                }

                document.querySelectorAll('.alt').forEach((alt) => {
                   if (element.querySelector('.name').dataset.value === alt.querySelector('.rank').dataset.main) {
                       if (alt.classList.contains('hidden') !== false) {
                           alt.classList.remove('hidden');
                           element.querySelector('.arrow').classList.add('down');
                       } else {
                           alt.classList.add('hidden');
                           element.querySelector('.arrow').classList.remove('down');
                       }
                   }
                });
            });
        }
    });
}

function globalSwitchAltsVisibility(desiredState) {
    if (sorted.includes('contr')) {
        sorted = 'none';
    }

    if (filtered.length !== 0) {
        return;
    }

    if (desiredState === true) {
        sorted = 'none';

        document.querySelector('.alter').querySelector('span').innerHTML = 'Hide';

        document.querySelectorAll('.main').forEach((element) => {
            let img = element.querySelector('.name').querySelector('img');
            if (img !== null) {
                img.classList.add('hidden');
            }
        });

        document.querySelectorAll('.alt').forEach((element) => {
            element.classList.remove('hidden');
        });

        altsVisible = true;

        setContribution(document.querySelectorAll('.main'), 'individual');
    } else {
        document.querySelector('.alter').querySelector('span').innerHTML = 'Show';

        document.querySelectorAll('.main').forEach((element) => {
            let img = element.querySelector('.name').querySelector('img');
            if (img !== null) {
                img.classList.remove('hidden');
            }
        });

        document.querySelectorAll('.alt').forEach((element) => {
            element.classList.add('hidden');
        });

        altsVisible = false;
        sortAltsAfterMains();

        setContribution(document.querySelectorAll('.main'), 'combined');
    }
}

function globalSwitchAltsVisibilityListener() {
    document.querySelector('.alter').addEventListener('click', () => {
        globalSwitchAltsVisibility(!altsVisible);
    })
}

function searchResults(query) {
    globalSwitchAltsVisibility(true);
    showAll();
    document.querySelectorAll('.row').forEach((element) => {
        if (element.querySelector('.name').dataset.value.toLowerCase().search(query) === -1) {
            element.classList.add('hidden');
        }
    })
}

function searchListener() {
    document.querySelector('.search').querySelector('input').addEventListener('input',(e) => {
        searchResults(e.target.value.toLowerCase());
    })
}

function filterListener() {
    document.querySelectorAll('.option').forEach((element) => {
        element.addEventListener('click', () => {
            filter(element);
        })
    })
}

function filter(element) {
    const elementContext = element.querySelector('span').innerHTML.toLowerCase();

    if (altsVisible === false) {
        globalSwitchAltsVisibility(true);
    }
    
    if (elementContext === 'none') {
        showAll();
        filtered = [];
        return
    }

    let filter = {};

    if (element.dataset.category === undefined) {
        filter.category = elementContext;
        filter.value = true;
    } else {
        filter.category = element.dataset.category;
        filter.value = elementContext;
    }

    filtered.forEach((filterElement) => {
        if (filter.category === 'type' && filterElement.category === 'class') {
            filtered = [];
            showAll();
        } else if (filter.category === 'type' && filterElement.category === 'type') {
            filtered = [];
            showAll();
        } else if (filter.category === 'class' && filterElement.category === 'type') {
            filtered = [];
            showAll();
        } else if (filter.category === 'class' && filterElement.category === 'class' && filter.value !== filterElement.value) {
            filtered = [];
            showAll();
        } else if (filter.category === 'rank' && filterElement.category === 'rank' && filter.value !== filterElement.value) {
            filtered = [];
            showAll();
        }
    });

    document.querySelectorAll('.row').forEach((element2) => {
        if (element.dataset.category === undefined) {
            if (element2.querySelector(`.${elementContext}`).dataset.value !== '1') {
                element2.classList.add('hidden');
            }
        } else {
            if (element.dataset.category !== 'type') {
                if (filter.category === 'rank' && filter.value === 'alt') {
                    if (element2.querySelector(`.${element.dataset.category}`).dataset.value.toLowerCase() !== 'alt' && element2.querySelector(`.${element.dataset.category}`).dataset.value.toLowerCase() !== 'alts') {
                        element2.classList.add('hidden');
                    }
                } else if (element2.querySelector(`.${element.dataset.category}`).dataset.value.toLowerCase() !== elementContext) {
                    element2.classList.add('hidden');
                }
            } else {
                if (elementContext === 'dmg') {
                    if (element2.querySelector('.class').dataset.value === 'Priest' || element2.querySelector('.class').dataset.value === 'Mystic') {
                        element2.classList.add('hidden');
                    }
                } else {
                    if (element2.querySelector('.class').dataset.value !== 'Priest' && element2.querySelector('.class').dataset.value !== 'Mystic') {
                        element2.classList.add('hidden');
                    }
                }

            }
        }
    });

    if (document.querySelectorAll('.row').length === document.querySelectorAll('.row.hidden').length) {
        console.log('0 results, clap');
    }

    filtered.push(filter);
}

document.addEventListener('DOMContentLoaded', () => {
    globalSwitchAltsVisibility(false);
    globalSwitchAltsVisibilityListener();
    sortListener();
    searchListener();
    filterListener();

    //make below listeners instead of listener + function
    miscStateChange();
    switchAltsVisibility();
    switchColumnVisibility();
});