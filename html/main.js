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

document.addEventListener('DOMContentLoaded', () => {
    checkChanges();
});