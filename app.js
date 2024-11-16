let model;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const clearButton = document.getElementById('clear');
const recognizeButton = document.getElementById('recognize');
const resultDiv = document.getElementById('result');

// Set up the canvas
ctx.strokeStyle = 'white';
ctx.lineWidth = 10;
ctx.lineCap = 'round';
ctx.fillStyle = 'black';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Set up drawing functionality
let isDrawing = false;
let lastX = 0;
let lastY = 0;

function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function draw(e) {
    if (!isDrawing) return;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function stopDrawing() {
    isDrawing = false;
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Clear the canvas
function clearCanvas() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    resultDiv.textContent = '';
}

clearButton.addEventListener('click', clearCanvas);

// Load the pre-trained model
async function loadModel() {
    model = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/mnist_v1/model.json');
}

loadModel();

// Recognize the digit
async function recognizeDigit() {
    if (!model) {
        console.log('Model not loaded yet');
        return;
    }

    // Preprocess the canvas image
    let tensor = tf.browser.fromPixels(canvas, 1)
        .resizeNearestNeighbor([28, 28])
        .mean(2)
        .expandDims(2)
        .expandDims()
        .toFloat()
        .div(255.0);

    // Make a prediction
    let predictions = await model.predict(tensor).data();
    let results = Array.from(predictions);
    let maxPrediction = Math.max(...results);
    let predictedDigit = results.indexOf(maxPrediction);

    resultDiv.textContent = `Predicted Digit: ${predictedDigit}`;
}

recognizeButton.addEventListener('click', recognizeDigit);