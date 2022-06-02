//mailer.js donde se configura el envio de mensajes.

const nodemailer = require('nodemailer')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')
const { default: axios } = require('axios')


let transporter = nodemailer.createTransport({
    service: 'gmail', auth: {
        user: '',   //AQUÍ SE DEBE INGRESAR UN CORREO ELECTRÓNICO Y REPETIRLO EN LA LÍNEA 47
        pass: '',   //INGRESAR PASSWORD DEL CORREO ELECTRÓNICO INDICADO ANTERIORMENTE
    },
})

//Realizar una petición a la API de mindicador.cl que captura valores del dólar, euro, uf y utm
const obtenerIndicador = async () => {
    try {
        return await axios.get("https://mindicador.cl/api")
    }
    catch (error) {
        console.log(error)
    }
}

//Preparar un template que incluya los valores del Dólar, Euro, UF y UTM, el que debe ser concatenado al mensaje descrito por el usuario en el formulario HTML.
const enviar = (correos, asunto, contenido) => {
    return new Promise(async (resolve, reject) => {
        //Llama la función para obtención de indicadoresdesde la API
        const datos = await obtenerIndicador()
        //Almacena valores consumidos desde la API
        const dolar = datos.data.dolar.valor
        const euro = datos.data.euro.valor
        const uf = datos.data.uf.valor
        const utm = datos.data.utm.valor
        
        //Prepara template antes indicado
        const template = `
        <br>A continuación, los indicadores económicos del día son los siguientes:<br>
        <p>El valor del Dólar el día de hoy es: $${dolar}</p>
        <p>El valor del Euro el día de hoy es: $${euro}</p>
        <p>El valor de la U.F. el día de hoy es: $${uf}</p>
        <p>El valor de la U.T.M. el día de hoy es: $${utm}</p>
        <br>`
        //Características del envío
        let mailOptions = {
            from: '',   //INGRESAR EMAIL DE LA LÍNEA 11
            to: correos,
            subject: asunto,
            html: contenido + template
        }
        transporter.sendMail(mailOptions, (err, data) => {
            if (err) {
                console.log(err)
                reject(err)
            }
            else {
                //Guarda respaldos de los correos enviados en carpeta ./correos
                let emailid = uuidv4().slice(30)
                fs.mkdir('./correos', () => {
                    fs.writeFile(`./correos/${emailid}.pdf`, contenido + template, "utf-8", () => {
                        resolve(data)
                    })
                })
            }
        })

    })
}
module.exports = enviar