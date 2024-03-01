// для глубокого копирования массивов
Array.prototype.clone = function () {
	return this.slice(0);
};


let SIZE = 10;

let mas = [];
let masNext = [];

// раскраска квадратов по массиву mas после расчета шага в функции calculate
function setColor(mass){

    for(let i = 0; i < SIZE; i ++){
        for(let j = 0; j < SIZE; j ++){
            document.getElementById("sqr" + i + '-' + j).style.backgroundColor  = "white";
        }
    }

    for(let i = 0; i < SIZE; i ++){
        for(let j = 0; j < SIZE; j ++){
            if (mass[i][j] == 1){
                document.getElementById("sqr" + i + '-' + j).style.backgroundColor  = "blue";
            }  
        }
    }
}

// функция для обработки  нажатия на квадраты
function eventOnBoxes(event){
    let id = event.target.id;
    let idsFromBox = id.match(/\d+/g);
    let firstValue = idsFromBox[0]
    let secondValue = idsFromBox[1]

    if (mas[firstValue][secondValue] == 0){
        mas[firstValue][secondValue] = 1
    } else{
        mas[firstValue][secondValue] = 0
    }
    setColor(mas)
}

// создание квадратов и события на них
function drawBoxes(prevSize) {

    // при помощи sqr00- проверяем было ли уже построено поле,
    // если да, то очищаем все по старому значению SIZE 
    if(document.getElementById("sqr0-0")){
        removeBoxesAndEventsAndArrays(prevSize)
    }

    for (let i = 0; i < SIZE; i ++){
        const parentDiv = document.createElement("div");
        parentDiv.setAttribute("id","parentDiv" + i);
        parentDiv.classList.add("container");

        for (let j = 0; j < SIZE; j ++){
            const includedDiv = document.createElement("div");
        
            parentDiv.appendChild(includedDiv);
            
            includedDiv.setAttribute("id","sqr" + i + '-' + j);
            includedDiv.classList.add("box");
 
        }
        document.body.appendChild(parentDiv);
    }

    // события на нажатие квадратов
    for (let i = 0; i < SIZE; i ++){
        for (let j = 0; j < SIZE; j ++){
            const box = document.getElementById("sqr" + i + '-' + j);

            box.addEventListener("click", eventOnBoxes);
        }
    }
}

// создаем массивы mas и masNext
function createArrays(){
    let rows = SIZE;
    let cols = SIZE;
    
    for (let k = 0; k < rows; k++) {
        mas[k] = [];
        for (let l = 0; l < cols; l++) {
            mas[k][l] = 0;
        }
    }
    
    for (let k = 0; k < rows; k++) {
        masNext[k] = [];
        for (let l = 0; l < cols; l++) {
            masNext[k][l] = 0;
        }
    }
}

// эта функция удаляет квадраты, события на них, и чистит массивы
function removeBoxesAndEventsAndArrays(prevSize){

    for (let i = 0; i < prevSize; i++ ){
        for (let j = 0; j < prevSize; j++){
            mas[i][j] = 0
        }
    }

    for (let i = 0; i < prevSize; i++ ){
        for (let j = 0; j < prevSize; j++){
            masNext[i][j] = 0
        }
    }

    for (let i = 0; i < prevSize; i ++){
        for (let j = 0; j < prevSize; j ++){
            const box = document.getElementById("sqr" + i + '-' + j);

            box.removeEventListener("click", eventOnBoxes);
        }
    }

    for (let i = 0; i < prevSize; i ++){
        let box = document.getElementById("parentDiv" + i);
        document.body.removeChild(box)
    }
}


// кнопки
let buttons = document.createElement("div");

let buttonStart = document.createElement("button");
buttonStart.disabled = true;
buttonStart.innerHTML = "Start";
buttons.appendChild(buttonStart);

let buttonStop = document.createElement("button");
buttonStop.innerHTML = "Stop";
buttonStop.disabled = true;
buttons.appendChild(buttonStop);

let buttonEnter = document.createElement("button");
buttonEnter.innerHTML = "Enter";
buttons.appendChild(buttonEnter);

document.body.appendChild(buttons);

// прослушиваем кнопки
let intervalId
buttonStart.addEventListener ("click", function() {
    this.disabled = true
    buttonStop.disabled = false
    buttonEnter.disabled = true

    intervalId = setInterval(()=>{
        calculate()
        setColor(mas)
    },200)
  });


buttonStop.addEventListener ("click", function() {
    this.disabled = true
    buttonStart.disabled = false
    buttonEnter.disabled = false

    clearInterval(intervalId);

});

buttonEnter.addEventListener("click", (event) => {
    // если уже было создано поле, 
    // то нужно его очистить по предыдущему значению SIZE
    buttonStart.disabled = false;
    let prevSize = SIZE;
    SIZE = document.getElementById('inputId').value;
    drawBoxes(prevSize)
    createArrays()
});


// пересчитываем следующий шаг в masNext на основе mas,
// записываем значение в mas и чистим masNext
function calculate(){
    for(let q= 0; q < SIZE; q++ ){
        let row = ''
        for(let w = 0; w < SIZE; w++ ){
            let neighbours = 0;
    
    
            neighbours += calculateTopLeft(q,w);
    
            neighbours += calculateTop(q,w);
    
            neighbours += calculateTopRight(q,w);
    
            neighbours += calculateRight(q,w);
    
            neighbours += calculateBotRight(q,w);
    
            neighbours += calculateBot(q,w);
    
            neighbours += calculateBotLeft(q,w);
    
            neighbours += calculateLeft(q,w);
    
            masNext[q][w] = 0
    
            if(mas[q][w] == 0 && neighbours == 3){
                masNext[q][w] = 1
            }
    
            if(mas[q][w] == 1 && (neighbours == 2 || neighbours == 3) ){
                masNext[q][w] = 1
            } 
    
            // row = row + masNext[q][w]
    
        }
        // console.log(row + '  !row!'+ q)
    }
    
    for(let i = 0; i< SIZE; i++){
        mas[i] = masNext[i].clone()
    }

    for (let i = 0; i < SIZE; i++ ){
        for (let j = 0; j < SIZE; j++){
            masNext[i][j] = 0
        }
    }
    
}

// вычисления значений соседей для квадра
function calculateTopLeft(q,w){

    let neighbours = 0;

    if( (q == 0) && (w == 0) ){
        let topLeft = mas[SIZE-1][SIZE-1]
        if(topLeft == 1) neighbours += 1
    }

    if( (q == 0) && (w > 0) ){
        let topLeft = mas[SIZE-1][w-1]
        if(topLeft == 1) neighbours += 1
    }

    if( (q > 0) && (w == 0) ){
        let topLeft = mas[q-1][SIZE-1]
        if(topLeft == 1) neighbours += 1
    }

    // для всех остальных
    if( (q > 0) && (w > 0)){
        let topLeft = mas[q-1][w-1]
        if(topLeft == 1) neighbours += 1
    }

    return neighbours;
}

function calculateTop(q,w){

    let neighbours = 0;

    if( q == 0 ){
        let topLeft = mas[SIZE-1][w]
        if(topLeft == 1) neighbours += 1
    }

    // для всех остальных
    if( q > 0){
        let top = mas[q-1][w]
        if(top == 1) neighbours += 1
    }

    return neighbours;
}

function calculateTopRight(q,w){

    let neighbours = 0;

    if( (q == 0) && (w == SIZE-1) ){
        let topRight = mas[SIZE-1][0]
        if(topRight == 1) neighbours += 1
    }

    if( (q == 0) && (w < SIZE-1) ){
        let topRight = mas[SIZE-1][w+1]
        if(topRight == 1) neighbours += 1
    }

    if( (q > 0) && (w == SIZE-1) ){
        let topRight = mas[q-1][0]
        if(topRight == 1) neighbours += 1
    }

    // для всех остальных
    if( (q > 0) && (w < SIZE-1)){
        let topRight = mas[q-1][w+1]
        if(topRight == 1) neighbours += 1
    }

    return neighbours;
}

function calculateRight(q,w){

    let neighbours = 0;

    if( w == SIZE-1 ){
        let right = mas[q][0]
        if(right == 1) neighbours += 1
    }

    // для всех остальных
    if( w < SIZE-1){
        let right = mas[q][w+1]
        if(right == 1) neighbours += 1
    }

    return neighbours;
}
// здесь я в каждом возвращаю т.к совпадают условия
function calculateBotRight(q,w){

    let neighbours = 0;

    if( (q == SIZE-1) && (w == SIZE-1) ){
        let botRight = mas[0][0]
        if(botRight == 1) neighbours += 1
        return neighbours;
    }

    if( (q == SIZE-1) && (w < SIZE-1) ){
        let botRight = mas[0][w+1]
        if(botRight == 1) neighbours += 1
        return neighbours;
    }

    if( (q >= 0) && (w == SIZE-1) ){
        let botRight = mas[q+1][0]
        if(botRight == 1) neighbours += 1
        return neighbours;
    }

    // для всех остальных
    if( (q < SIZE-1) && (w < SIZE-1)){
        let botRight = mas[q+1][w+1]
        if(botRight == 1) neighbours += 1
        return neighbours;
    }

}

function calculateBot(q,w){

    let neighbours = 0;

    if( q == SIZE-1 ){
        let bot = mas[0][w]
        if(bot == 1) neighbours += 1
    }

    // для всех остальных
    if( q < SIZE-1){
        let bot = mas[q+1][w]
        if(bot == 1) neighbours += 1
    }

    return neighbours;
}

// здесь я в каждом возвращаю т.к совпадают условия
function calculateBotLeft(q,w){

    let neighbours = 0;

    if( (q == SIZE-1) && (w == 0) ){
        let botLeft = mas[0][SIZE-1]
        if(botLeft == 1) neighbours += 1
        return neighbours;
    }

    if( (q == SIZE-1) && (w > 0) ){
        let botLeft = mas[0][w-1]
        if(botLeft == 1) neighbours += 1
        return neighbours;
    }

    if( (q >= 0) && (w == 0) ){
        let botLeft = mas[q+1][SIZE-1]
        if(botLeft == 1) neighbours += 1
        return neighbours;
    }

    // для всех остальных
    if( (q < SIZE-1) && (w > 0)){ 
        let botLeft = mas[q+1][w-1]
        if(botLeft == 1) neighbours += 1
        return neighbours;
    }
}

function calculateLeft(q,w){

    let neighbours = 0;

    if( w == 0 ){
        let bot = mas[q][SIZE-1]
        if(bot == 1) neighbours += 1
    }

    // для всех остальных
    if( w > 0){ 
        let left = mas[q][w-1]
        if(left == 1) neighbours += 1
    }

    return neighbours;
}