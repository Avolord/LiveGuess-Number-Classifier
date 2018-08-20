Animation(true);
recordMousePos(Canvas.Element);

let guesser = new liveG(Canvas.Element, 28, 28);
let mousehold = false;
let ImgC;

function setup() {
  ClearCanvasOnLoop = false;
  FrameRate = 60;
  console.log("guesser.clearData() cleares the image.");
  console.log("Load the Neuronal Network.json with [Browse...].")
}

function draw() {
  if (mousehold) {
    guesser.setInput(mouseX, mouseY);
    if(ImgC) {
      let result = ImgC.guess(guesser.getData());
      let number = 0;
      result.forEach((val,i) => {number = (val > result[number]) ? i : number});
      document.getElementById("guess").innerHTML = "Number : "+number+" with "+Math.round(result[number]*100*100)/100+" %";
    }
  }
  document.getElementById("Count").innerHTML = FPS;

}

Canvas.Element.onmousedown = function() {
  mousehold = true;
}

Canvas.Element.onmouseup = function() {
  mousehold = false;
}

let saveFile = function(filename, data) {
  var blob = new Blob([data], {
    type: 'text/csv'
  });
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveBlob(blob, filename);
  } else {
    var elem = window.document.createElement('a');
    elem.href = window.URL.createObjectURL(blob);
    elem.download = filename;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
  }
}

function handleFiles(files) {
  // Check for the various File API support.
  if (window.FileReader) {
    // FileReader are supported.
    getAsText(files[0]);
  } else {
    alert('FileReader are not supported in this browser.');
  }
}

function getAsText(fileToRead) {
  var reader = new FileReader();
  // Read file into memory as UTF-8
  reader.readAsText(fileToRead);
  // Handle errors load
  reader.onload = loadHandler;
  reader.onerror = errorHandler;
}

function loadHandler(event) {
  var json = event.target.result;
  processData(json);
}

function processData(json) {
  ImgC = AvoNet.importObject(JSON.parse(json));
}

function errorHandler(evt) {
  if (evt.target.error.name == "NotReadableError") {
    alert("Canno't read file !");
  }
}
