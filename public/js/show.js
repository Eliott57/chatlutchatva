var myHeaders = new Headers({ 'Content-Type': 'application/json' });
    
var url = '/chats/get';

var options = { 
    method: 'GET',
    headers: myHeaders,
    mode: 'cors',
    cache: 'default',
};

fetch(url, options)
    .then((res) => {
        return res.json();
    })
    .then((response) => {
        
        const swiperWrapper = document.querySelector('.swiper-wrapper');
        
        response.chats.forEach(chat => {
            
            let newDiv = document.createElement('div');
            newDiv.classList.add('swiper-slide');
            
            let newImage = new Image();
            newImage.src = `img/chats/${chat.image}`;
            
            let newTitleDiv = document.createElement('div');
            newTitleDiv.classList.add('d-flex', 'flex', 'flex-row', 'justify-content-between', 'align-items-center', 'mb-2');

            let newName = document.createElement('div');
            newName.innerHTML = chat.nom;

            let newDeleteLink = document.createElement('div');
            let imgSplit = chat.image.split('.');

            newDeleteLink.id = imgSplit[0];
            newDeleteLink.dataset.ext = imgSplit[1];
            newDeleteLink.classList.add('bg-danger', 'text-white', 'delete-link', 'p-1');
            newDeleteLink.innerHTML = 'Supprimer';
            
            newTitleDiv.appendChild(newName);
            newTitleDiv.appendChild(newDeleteLink);

            newDiv.appendChild(newTitleDiv);
            newDiv.appendChild(newImage);

            swiperWrapper.appendChild(newDiv);

            newDeleteLink.addEventListener('click', (e) => {
                
                if(confirm('Êtes-vous sûr de vouloir supprimer ce magnifique chat?')){
                    var myHeaders = new Headers({ 'Content-Type': 'application/json' });
    
                    var url = '/chats/suppression';
    
                    var cat = {
                        name: e.target.id,
                        ext: e.target.getAttribute('data-ext')
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
                            location.reload();
                        });
                }
            });
        });
    });