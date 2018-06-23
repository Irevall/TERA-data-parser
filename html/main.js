function hiddenElements() {
    document.querySelector('.row').querySelectorAll('div').forEach((element, index) => {
        if (index >= 5 && index <= 11) {
            element.addEventListener('click', () => {
                console.log(index);
                document.querySelectorAll('.row').forEach((element2, index2) => {
                    let target = element2.querySelector('div:nth-child(' + (index + 1) + ')');
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
    });
}
document.addEventListener('DOMContentLoaded', () => {

    hiddenElements();
});
