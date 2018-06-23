function sendRequest() {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '../app/listener.js', true);

    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function() {//Call a function when the state changes.
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            // Request finished. Do processing here.
        }
    }

    xhr.send("foo=bar&lorem=ipsum");
    // xhr.send(new Blob());
    // xhr.send(new Int8Array());
    // xhr.send(document);
}

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



