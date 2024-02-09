let draggableObjects;
let dropPoints;
const startButton = document.getElementById("start");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
const dragContainer = document.querySelector("draggable-objects");
const dropContainer = document.querySelector("drop-points");
const data = ["belgium",
"bhutan"
,"brazil"
,"china"
,"cuba"
,"ecuador"
,"georgia",
"germany",
"hong-kong",
"india",
"iran",
"myanmar",
"norway",
"spain",
"sri lanka",
"sweden",
"switzerland",
"united-states",
"uruguay",
"wales",
];

let deviceType="";
let initialX=0,
    initialY = 0;
let currentElement ="";
let moveElement = false;
let count =0;
const randomValueGenerator= () =>{
    return data[Math.floor(Math.random() * data.length)];

};

const stopGame = () => {
    controls.classList.remove("hide");
    startButton.classList.remove("hide");
};

function dragStart(e) {
    e.dataTransfer.setData("text",e.target.id);
}
const drop = (e) => {
    e.preventDefault();
}
const draggedElementData = e.dataTransfer.getData("text");
const droppableElementData = e.target.getAttribute("data-id");
if(draggedElementData ===droppableElementData) {
    constdraggedElement = document.getElementById(draggedElementData);
    e.target.classList.add("dropped");
    draggedElementData.classList.add("hide");
    draggedElementData.setAttribute("draggable","false");
    e.target.innerHTML= ``;
    e.target.insertAdjacentHTML(
        "afterbegin",
        `<img src="${draggedElementData}.png">`
    );
    count+=1

}
if (count==3){
    result.innerText=`You Won!`;
    stopGame();
}

const creator =() =>{
    dragContainer.innerHTML="";
    dropContainer.innerHTML="";
    let randomData =[];

    for(let i=1;i<= 3;i++){
        let randomValue = randomValueGenerator();
        if (!randomData.includes(randomValue)){
            randomData.push(randomValue);
        }else{
            i-= 1;
        }
        }
    for(let i of randomData){
        const flagDiv = document.createElement("div");
        flagDiv.classList.add("draggable-image");
        flagDiv.setAttribute("draggable",true);
        if(isTouchDevice()){
            flagDiv.style.position="absolute";
        }
        flagDiv.innerHTML=`<img src="${i}.png"
        id="${i}">`;
        dragContainer.appendChild(flagDiv);

    }
    randomData= randomData.sort(()=>0.5-Math.random());
    for(let i of randomData) {
        const countryDiv=document.createElement("div");
        countryDiv.innerHTML = `<div class='countries' data-id='${i}`>
    }
    }
}