

//Realizar una petición a la API de mindicador.cl que captura valores del dólar, euro, uf y utm
const getIndicators = async () => {
    const { data } = await axios.get("https://mindicador.cl/api")
    const dolar = data.dolar.valor
    const euro = data.euro.valor
    const uf = data.uf.valor
    const utm = data.utm.valor
    const indicators = [dolar, euro, uf, utm]
    console.log(indicators)
    return indicators
}


const writeIndicators = async (indicators) => {
    const indicatorsValue = await getIndicators()
    const indicatorsMessage = `<br>A continuación, los indicadores económicos del día son los siguientes:<br>El valor del Dólar el día de hoy es: ${indicatorsValue.dolar}</p>
                    <p>El valor del Euro el día de hoy es: $${indicatorsValue.euro}</p>
                    <p>El valor de la U.F. el día de hoy es: $${indicatorsValue.uf}</p>
                    <p>El valor de la U.T.M. el día de hoy es: $${indicatorsValue.utm}</p>`
    console.log(indicatorsMessage)
    return indicatorsMessage
}

const getEmailData = (req) => {
    const { correos: to, subject, content } = url.parse(req.url, true).query
    const dataArray = to.split(',')
    const emailsSubjectMsg = { dataArray, subject, content }


    const solvedPromise = new Promise((resolve, reject) => {

        if (to !== '' && subject !== '' && message !== '') {
            resolve(emailsSubjectMsg)
        } else {
            reject('Usted debe completar todos los campos del formulario. No olvide indicar más de un correo electrónico separado por coma.')
        }
    })
    return solvedPromise
}