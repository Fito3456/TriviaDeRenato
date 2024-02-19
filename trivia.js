let preguntas=[]
let misRespuestas=  Array(10);
document.addEventListener("DOMContentLoaded", function(){
    let token = sessionStorage.getItem("token")
    if(token){
        console.log("Token encontrado" , token)
    } else{
        generarToken()
    }
})
function desordenar (){
    return Math.random()-0.5
}
const generarToken = () => {
    fetch("https://opentdb.com/api_token.php?command=request")
    .then(respuesta => {return respuesta.json()})
    .then(datos => {
        if(datos.token){
            sessionStorage.setItem('token', datos.token);
        }
    })
    .catch(error => {
        console.error("hubo un error generando el token" , error)
    })
}
const obtenerPreguntas = () => {
    let token = sessionStorage.getItem("token");
    if (token){
        const categoria = document.getElementById("select1").value;
        const dificultad = document.getElementById("select2").value;
        const tipo = document.getElementById("select3").value;
    
    if (!categoria === "" || dificultad === "" || tipo === "" ){
        alert("debes seleccionar las opciones correspondientes para continuar");
        return
    }
    else{
        let url = `https://opentdb.com/api.php?amount=10&category=${categoria}&difficulty=${dificultad}&type=${tipo}&token=${token}`;
        fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {
            if(datos.results.length > 0 ) {

                datos.results.map(preguntaAPI => {
                    preguntas.push(
                        {
                        pregunta: preguntaAPI.question,
                        respuestaCorrecta:  preguntaAPI.correct_answer,
                        respuestaIncorrecta: preguntaAPI.incorrect_answers,
                        respuestaAletorias:[preguntaAPI.correct_answer,...preguntaAPI.incorrect_answers].sort(desordenar)
                    })
                });
                
                preguntas.map((pregunta,indice)=>{
                    const preguntaHTML = document.createElement("div")
                    preguntaHTML.innerHTML = `
                    <h3  style="margin-bottom: 1rem;
                    position: relative;
                    text-shadow: 1px -1px 0 rgba(0, 0, 0, 0.3);
                    border-bottom: 0.5rem solid white;
                    width: 818px;
                    color: white; ">${pregunta.pregunta}</h3>
                    <ul >
                      ${pregunta.respuestaAletorias.map(respuesta => `<li class="respuesta"  onclick="agregarRespuestas('${respuesta}','${indice}')">${respuesta}</li>`).join('')}
                    </ul>
                  `;
                    document.getElementById("preguntas").appendChild(preguntaHTML)
                })
                    document.getElementById("form").hidden=true
                document.getElementById('questionario').hidden= false
            }else{
                document.getElementById('questionario').hidden= true
                alert("No hay una trivia disponible con las caracteristicas seleccionadas, por favor cambie los valores e intentalo de nuevo")
            }
        })
        .catch(error => console.error("hubo un error generando las preguntas", error))
    }}
    else{
        generarToken()
    }
}

const checkPreguntas = () =>{
    document.getElementById("questionario").hidden

}
const reset= () => {
    document.getElementById("questionario").hidden=true
    document.getElementById("form").hidden=false
}
const agregarRespuestas = (respuesta, indice)=>{
    misRespuestas[indice]=respuesta;
    actualizarEstilos(indice)
}
const prueba = ()=>{
    console.log(misRespuestas)
}
function checklleno(){
    return misRespuestas.every(elemento =>{
        return elemento !==undefined && elemento !== null
    })
}
const calificar =()=> {
    let puntaje = 0;
    if(checklleno()){
        misRespuestas.map((respuesta, indice)=>{
            if(respuesta===preguntas[indice].respuestaCorrecta) {puntaje = puntaje + 100}
            else aplicarEstiosCorrecto(indice)
            console.log(puntaje)
        })
        alert(`Tu puntaje es de  ${puntaje} puntos`)
    }else alert("debes llenar todas las respuestas")
}
function actualizarEstilos(indice){
    console.log(indice)
    const lista = document.getElementById('preguntas').children[indice].querySelector("ul");
    const respuestaHtml = lista.children;

    for(let  i = 0 ;i<respuestaHtml.length; i++){
        respuestaHtml[i].classList.remove("seleccionada") ;
}

    const respuestaSeleccionada = misRespuestas[indice]
    const elementoSeleccionado = Array.from(lista.children).find(elemento => elemento.innerText === respuestaSeleccionada)
    if(elementoSeleccionado){
        elementoSeleccionado.classList.add("seleccionada");
}
}

const aplicarEstiosCorrecto = (indice) =>{
    const lista = document.getElementById('preguntas').children[indice].querySelector("ul");
    const respuestaHtml = Array.from(lista.children);

    const respuestaCorrecta = preguntas[indice].respuestaCorrecta;
    const elementoCorrecta = respuestaHtml.find(elemento => elemento.innerHTML === respuestaCorrecta)

    if (elementoCorrecta) {
        elementoCorrecta.classList.add("respuesta-correcta")
         
    }

}