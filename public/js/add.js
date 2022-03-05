const submitBtn = document.querySelector('#submitForm');

const catName = document.querySelector('#name');

function ajout(){
    var myHeaders = new Headers({ 'Content-Type': 'application/json' });
    
    var url = '/chats/ajout';

    var cat = {
        name: catName.value
    }

    var options = { 
        method: 'POST',
        headers: myHeaders,
        mode: 'cors',
        cache: 'default',
        body: JSON.stringify(cat)
    };

    fetch(url, options)
        .then(() => {
            submitBtn.disabled = true;
            submitBtn.innerText = 'Ajouter';
            catName.value = '';
            dropzone.removeAllFiles();
            vNotify.success({text: 'Ton chat a été ajouté avec succès', title:'Félicitations'});
        });
}

catName.addEventListener('input', (e) => {
    if(e.target.value.trim().length > 2 && dropzone.getAcceptedFiles().length){
        submitBtn.disabled = false;
    }else{
        submitBtn.disabled = true;
    }
});

submitBtn.addEventListener('click', () => {
    this.innerHtml = '<i class="fas fa-circle-notch fa-spin"></i>';
    ajout();
});