//Variables requeridas
const url = require("url")
const http = require("http")
const axios = require("axios")
const { v4: uuidv4 } = require('uuid')
const fs = require("fs")
const send = require("./mailing")

//Levanta el servidor
http.createServer(function (req, res) {
    //Declara variables obtenidas del formulario HTML al presionar el botón de envío
    let { correos, asunto, contenido } = url.parse(req.url, true).query
    if (req.url == "/") {
        //Se define encabezado como text/html
        res.setHeader("content-type", "text/html")
        //Lectura del index.html para verificación de recepción de información
        fs.readFile('index.html', 'utf-8', (err, data) => {
            if (err) {
                console.log(err, 'No  están toos los campos del formulario o no hay conexión con el servidor.')
                res.end()
            }
            if (data) {
                res.end(data)
            }
        })



        //Endpoint (etiqueta del formulario en index.html)
        if (req.url.includes("/mailing")) {
            //Llamado a función que obtiene indicadores de la API
            const allIndex = await getIndicators()
            //Llamado a función que obtiene valores de los indicadores de interés
            const valueIndex = await writeIndicators(allIndex)
            //Llamado a función que obtiene datos del formulario
            
            const emailData = getEmailData(req)

            emailData.then((resolve) => {

                /* utilizo el metodo split para tomar los correos ingresados y separados por una coma (,) 
                            para crear un arreglo de correos. */
                send(correos.split(','), asunto, template)
                    .then(respuesta => {
                        console.log(respuesta);
                        res.end("correo enviado correctamente.");
                    })
                    .catch(error => {
                        console.log(error);
                        res.end("se ha generado un error al send el correo electronico.");
                    })

                console.log(template)

                let nombre = uuidv4();

                /* utilizo file system para crear un nuevo archivo en formato txt que sera guardado en la carpeta correos. */
                /* ademas, se utiliza como callbakc la variable error, para saber si existe un problema o no y luego imprimir un mensaje. */
                fs.writeFile(`correos/${nombre}.txt`, template, "utf-8", (error) => {
                    if (error) {
                        res.write("ha ocurrido un error al crear el archivo.")
                    } else {
                        res.write("El archivo a sido creado correctamente")
                    }
                    res.end();
                })

            })
                /* captura el error en el caso que la API no pueda ser accedida y luego imprimo un mensaje para indicar esto. */
                .catch(error => {
                    console.log(error);
                    res.end("se ha generado un error al consultar la API.");
                })

        }

    }
})
    .listen(3000, console.log("Servidor corriendo en http://localhost:3000/"));
