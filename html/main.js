function checkChanges() {
    document.querySelectorAll('input[type=checkbox]').forEach((element, index) => {
        element.addEventListener('change', (e) => {
            console.log('index: ' + index);
            console.log('event: ');
            console.log(e);
            // if(this.checked) {
            //     // Checkbox is checked..
            // } else {
            //     // Checkbox is not checked..
            // }
        });
    });
}

function hideElements() {
    document.querySelectorAll('th').forEach((element, index) => {
        if (index >= 5 && index <= 11) {
            element.addEventListener('click', () => {
                document.querySelectorAll('tr').forEach((element2, index2) => {
                    if (index2 === 0) {
                        return false;
                    } else {
                        element2.querySelectorAll('td')[index].classList.remove('hidden');
                        element2.querySelectorAll('td')[index].classList.add('visible');
                    }
                });
            })
        }
    });
}
document.addEventListener('DOMContentLoaded', () => {
    checkChanges();
    hideElements();
});