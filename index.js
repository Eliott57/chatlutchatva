const path = require('path');

const express = require('express');

const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
const fs = require('fs');
const chats = require('./data/chats.json')

const app = express();

app.use(fileUpload({
    createParentPath: true
}));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended : true }));
app.use(express.json());

app.listen(3000, () => {
    console.log('Server Launch on Port : 3000')
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/chats/ajout', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views/chats/ajout.html'))
});

app.post('/chats/ajout', async (req, res) => {
    

    fs.readdir(path.join(__dirname, 'public/img/tmp'), (err, files) => {
        if (err) {
            return console.log(`Impossible d'ouvrir le dossier: ${err}`);
        } 
        
        files.forEach((file) => {
            
            var randomKey = Buffer.from(Math.random().toString()).toString("base64").substr(10, 5);

            const tempFilePath = path.join(__dirname, 'public/img/tmp/', file);
            const filePath = path.join(__dirname, 'public/img/chats/', `${req.body.name}-${randomKey}${path.extname(file)}`);

            var chat = {
                nom: req.body.name, 
                image: `${req.body.name}-${randomKey}${path.extname(file)}` 
            }
            
            fs.readFile('data/chats.json', (err, data) => {

                var json = JSON.parse(data);
                json.chats.push(chat);
            
                fs.writeFileSync("data/chats.json", JSON.stringify(json))
            });

            fs.rename(tempFilePath, filePath, (err) => {
                res.status(200).send('Chat ajouté avec succès');
            });
        });
    });
});

app.post('/chats/ajout/image', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            const file = Object.values(Object.assign({},req.files))[0];
            
            //Suppression des images déjà présentes dans le dossier temporaire au cas où
            fs.readdir('./public/img/tmp/', (err, files) => {
                if (err) throw err;
              
                for (const file of files) {
                    fs.unlink(`./public/img/tmp/${file}`, err => {
                        if (err) throw err;
                      });
                }
              });

            file.mv(`./public/img/tmp/${file.name}`);

            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: file.name,
                    mimetype: file.mimetype,
                    size: file.size
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/chats/suppression/image', async (req, res) => {
    
    fs.readdir('./public/img/tmp/', (err, files) => {
        if (err) throw err;
      
        for (const file of files) {
            fs.unlink(`./public/img/tmp/${file}`, err => {
                if (err) throw err;
              });
        }
      });

});

app.post('/chats/suppression', async (req, res) => {
    
    const name = req.body.name;
    const ext = req.body.ext;

    try {
        fs.unlinkSync(`./public/img/chats/${name}.${ext}`)
    } catch(err) {
        console.error(err)
    }

    fs.readFile('data/chats.json', (err, data) => {

        var json = JSON.parse(data);
        json = json.chats.filter(chat => chat.image !== `${name}.${ext}`);

        var jsonFile = {
            chats: json
        }
        
        fs.unlinkSync("data/chats.json");
        fs.writeFileSync("data/chats.json", JSON.stringify(jsonFile));

        res.status(200).send('Chat supprimé avec succès');
    });
    


});

app.get('/chats', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views/chats/index.html'))
});

app.get('/chats/get', (req, res) => {
    res.send(chats);
});