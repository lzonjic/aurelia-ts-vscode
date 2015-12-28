import * as express from 'express';
import * as path from 'path';
import * as browserSync from 'browser-sync';

var app = express();

//app.set('view engine', 'html'); // so you can render('index')

app.use(express.static(__dirname + '/public'));

app.get('/api/nav', (req, res) => {
    res.send({
        data: [
            'Home',
            'About',
            'Test'
        ]
    });
});

var port: number = process.env.PORT || 5000;
var server = app.listen(port, () => {
    var listeningPort: number = server.address().port;
    browserSync({
      proxy: 'localhost:' + port,
      files: [__dirname + '/public/**/*.{js,css,html}']
    });
    console.log(`Yo!! The server is listening on port: ${listeningPort}`);
});
