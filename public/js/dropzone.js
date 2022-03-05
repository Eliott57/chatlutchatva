Dropzone.autoDiscover = false; // This is optional in this case

const dropzone = new Dropzone("#dropzone-chats", {

    uploadMultiple: true,
    acceptedFiles: '.png, .jpg, .webp',
    maxFiles: 1,
    clickable: '.browse',
    dictDefaultMessage : '',
    dictRemoveFile : 'Supprimer',
    dictCancelUpload : 'Annuler',
    addRemoveLinks: true,
    
    init: function () {

        const dropzoneContainer = document.querySelector('.dropzone-container');

        this.on('success', () => {
            if(catName.value.trim().length > 2 && this.getAcceptedFiles().length){
                submitBtn.disabled = false;
            }else{
                submitBtn.disabled = true;
            }
        });

        this.on("addedfile", file => {
            dropzoneContainer.style.display = 'none';
        });
        this.on('removedfile', file => {
            dropzoneContainer.style.display = 'flex';
            submitBtn.disabled = true;
            
            var myHeaders = new Headers();
    
            var url = '/chats/suppression/image';

            var options = { 
                method: 'GET',
                headers: myHeaders,
                mode: 'cors',
                cache: 'default',
            };

            fetch(url, options)
                .then((res) => {
                    'here'
                });
        })
        this.on("error", (file) => {
            file.previewElement.remove();
        });
    }

});