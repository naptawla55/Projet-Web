let draggableObjects;
let dropPoints;
const startButton = document.getElementById("start");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
const dragContainer = document.querySelector("draggable-objects");
const dropContainer = docyment.querySelector("drop-points");
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

const isTouch