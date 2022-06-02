//Archivo index.js donde se levanta servidor

//Importar módulos requeridos para la ejecución correcta
const enviar = require('./mailer') 
const url = require('url')
const http = require('http') 
const fs = require('fs')
const port = 3000

//Levanta el servidor
http.createServer(function (req, res) {
        //Declara variables obtenidas del formulario HTML al presionar el botón de envío
        let { correos, asunto, contenido } = url.parse(req.url, true).query 
        if (req.url == '/') {
        //Se define encabezado como text/html y ruta raiz en que devolverá contenido html
            res.setHeader('content-type', 'text/html') 
            //Devolviendo contenido del archivo index.html
            fs.readFile('index.html', 'utf8', (err, data) => {
                res.end(data)
            })
        }
        //Endpoint (etiqueta del formulario del index.html) y ejecución de función enviar con control de éxito/error de envío
        if (req.url.startsWith('/mailing')) {
            correos !== '' && asunto !== '' && contenido !== '' && correos.includes(',')
                ? (
                    enviar(correos.split(','), asunto, contenido),
                    res.write('Correos enviados exitosamente.'),
                    res.end())
                : res.write('Revise la información. Hay campos vacíos, se ha ingresado un correo único o los múltiples correos no están separados por coma.')
                res.end()
        }
})
.listen(port, () => console.log(`Escuchando el puerto ${port}`))