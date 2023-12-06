const moves = document.getElementById("moves");
const contenedor = document.querySelector(".contenedor");
const starBtn = document.getElementById("star-button");
const coverScreen = document.querySelector(".cover-screen");
const resultado = document.getElementById("result");

let currentElement = "";
let movesCount, 
    imgArr = [];

const isTouchDevice =  () => {
    try {
        // intento crear un evento, si falla para desktop tira un error
        document.createEvent("TouchEvent");
        return true;

    } catch(e) {
        return false;
    }
};

const randomNumber = () => Math.floor(Math.random() * 8 + 1 );

// obtener fila y columna del data-position

const getCoords = (element) => {
    const [row, col] = element.getAttribute("data-position").split("_");
    return [parseInt(row), parseInt(col)];

};

// fila1 y col1 esdtan coordinadas con la img, minetras que fila2 y col2 estan en blanco aun - son coordenadas en blanco aun

const checkAdjacent = (row1, row2, col1, col2) => {
    if(row1 == row2) {
        //izq // derecha
        if(col2 == col1 -  1 || col2 == col1 + 1 ) {
            return true;
        }
    } else if ( col1 == col2) {
        //arriba // abajo
        if(row2 == row1 - 1 || row2 == row1 + 1) {
            return true
        }
    }
    return false;
};


// reyenar array con valor de imagenes 

const randomImg = () => {
    while (imgArr.length < 8) {
        let randomValue = randomNumber();
        if (!imgArr.includes(randomValue)) {
            imgArr.push(randomValue);
        }
    }

    imgArr.push(9);
};

// generando el grid

const gridGenerador = () => {
    let count = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let div = document.createElement("div");
            div.setAttribute("data-position", `${i}_${j}`);
            div.addEventListener("click", selectImage);
            div.classList.add("img-contenedor");
            div.innerHTML = 
            `
            <img src="img/image_part_00${imgArr[count]}.png" class= "image ${imgArr[count] == 9 ? "target" : "" }" data-index="${imgArr[count]}"/>
            `;
            count += 1;
            contenedor.appendChild(div);
        }
    }
};

// click en la imagen

const selectImage = (e) => {
    e.preventDefault();
    // seteo del currentElement
    currentElement = e.target;
    //target (blank img)
    let targetElemnt = document.querySelector(".target");
    let currentParent = currentElement.parentElement;
    let targetParent = targetElemnt.parentElement;

    // obtener valores de ambos elementos fila y col 

    const [row1, col1] = getCoords(currentParent);
    const [row2, col2] = getCoords(targetParent);

    if(checkAdjacent(row1, row2, col1, col2)){
        // intercambiamos
        currentElement.remove();
        targetElemnt.remove();

        // obtene indice de imagen para ser usado y manipulado mas tarde por el array
        
        let currentIndex = parseInt(currentElement.getAttribute("data-index"));
        let targetIndex = parseInt(targetElemnt.getAttribute("data-index"));
        
        // cambiar el index

        currentElement.setAttribute("data-index", targetIndex);
        targetElemnt.setAttribute("data-index", currentIndex);

        // cambiar imagenes

        currentParent.appendChild(targetElemnt);
        targetParent.appendChild(currentElement);

        //cambiar arrays

        let currentArrIndex = imgArr.indexOf(currentIndex);
        let targetArrIndex = imgArr.indexOf(targetIndex);

        // desestructuracion del array, lo explico abajo por si algun dia me olvido jajaja

        /*  En este caso, [imgArr[currentArrIndex], imgArr[targetArrIndex]] = [imgArr[targetArrIndex], imgArr[currentArrIndex]] está intercambiando los valores de imgArr[currentArrIndex] e imgArr[targetArrIndex].

        Después de ejecutar esta línea de código, el valor que estaba en imgArr[currentArrIndex] estará ahora en imgArr[targetArrIndex], y viceversa. Es una forma concisa de intercambiar dos valores sin necesidad de una variable temporal. 😊 */

        [imgArr[currentArrIndex], imgArr[targetArrIndex]] = [
            imgArr[targetArrIndex], imgArr[currentArrIndex],
        ];

        // condiciones de ganador

        if(imgArr.join("") == "123456789") {
            setTimeout(() => {
                // cuando el juego termina el boton aparece de nuevo
                coverScreen.classList.remove("hide");
                contenedor.classList.add("hide");
                resultado.innerText = `Total de movimientos: ${movesCount}`;
                starBtn.innerText = `Volver a jugar`;
            }, 1000);
        }

        movesCount += 1;
        moves.innerText = `Movimientos: ${movesCount}`;
    }
};

// al hacer click en iniciar el juego tiene que aparecer el contador

starBtn.addEventListener("click", () => {
    contenedor.classList.remove("hide");
    coverScreen.classList.add("hide");
    contenedor.innerHTML = "";
    imgArr = [];
    randomImg();
    gridGenerador();
    movesCount = 0;
    moves.innerText = `Cantidad de movimientos: ${movesCount}`;
});

// mostrar primero la pantalla de inicio

window.onload = () => {
    coverScreen.classList.remove("hide");
    contenedor.classList.add("hide");
};
