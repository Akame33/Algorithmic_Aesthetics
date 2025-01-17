
let sliders = [];
let colors = [];
let data = [];
const numberColors = 4;
const numberConcepts = 8;
const conceptNames = ["Active", "Bright", "Warm", "Wet", "Sugary", "Acid", "Noisy", "Harmonious"];

function setup() {
  let canvas = createCanvas(windowWidth - 500, windowHeight - 180);

  // let canvas = createCanvas(900, 700);
  canvas.parent('corp'); // Place le canvas dans l'élément avec l'id 'corp'
  colorMode(HSL);

  for (let i = 0; i < numberConcepts; i++) {
    sliders.push(createSlider(0, 10, 5));
  }

  generateButton = createButton("Generate colors").mousePressed(generateColors);
  exportButton = createButton("Export CSV file").mousePressed(exportCSV);

  generateColors();
}

function draw() {
  background(240);

  // Les bandes de couleurs
  let margin = 60; 
  let stripeWidth = (width - margin * 2) / numberColors; 
  for (let i = 0; i < colors.length; i++) {
    fill(colors[i]);
    noStroke();
    rect(i * stripeWidth + margin, 60, stripeWidth, 400, 5); 
  }

  // Positionnement des sliders et des concepts
  let sliderWidth = width / 7;
  // let sliderHeight = 20;
  let sliderSpacing = 40;
  let startY = height/1.4;

  textSize(16);
  fill(30);
  for (let i = 0; i < numberConcepts; i++) {
    let x = i < 4 ? width / 3 : 3 * width / 4;
    let y = startY + (i % 4) * sliderSpacing;

    text(`${conceptNames[i]}: ${sliders[i].value() / 10}`, x - sliderWidth / 2 + 100, y - 25);
    sliders[i].position(x - (sliderWidth) / 2 + 150, y + 860);
    sliders[i].style('width', `${sliderWidth}px`);
  }

  // Positionnement des boutons
  let buttonY = height + 700;
  generateButton.position(width / 3 + 270, buttonY + 100);
  exportButton.position(width / 3 + 470, buttonY + 100);
}


function windowResized() {
  resizeCanvas(windowWidth - 500, windowHeight);
} 

// Couleurs HSV aléatoires
function generateColors() {
  colors = [];
  for (let i = 0; i < numberColors; i++) {
    let h = random(360);
    let s = random(30, 100);
    let v = random(30, 100);
    colors.push(color(h, s, v));
  }
  updateBallColors();  // Mettre à jour les couleurs des boules
  saveData();
}

// Mettre à jour les couleurs des boules dans le HTML
function updateBallColors() {
  // Récupérer les boules depuis le DOM
  let circle1 = document.querySelector('.circle-1');
  let circle2 = document.querySelector('.circle-2');
  let circle3 = document.querySelector('.circle-3');

  // Appliquer les couleurs générées
  if (circle1) {
    circle1.style.backgroundColor = colors[0];
  }
  if (circle2) {
    circle2.style.backgroundColor = colors[1];
  }
  if (circle3) {
    circle3.style.backgroundColor = colors[2];
  }
}
// Concept et valeurs associées (enregistrement)
function saveData() {
  let conceptValues = sliders.map(slider => slider.value() / 10); // Faire en sorte que les valeurs aillent de 0 à 1 avec une décimale après la virgule
  let colorValues = colors.map(c => {
    return [hue(c), saturation(c), brightness(c)];
  });

  data.push({
    concepts: conceptValues,
    colors: colorValues
  });

  if (data.length > 100) {
    data.shift(); // Limiter la taille à 100 lignes (100 sets de couleurs)
  }
}
"Active", "Bright", "Warm", "Wet", "Sugary", "Acid", "Noisy", "Harmonious"
// Exporter les données dans un fichier CSV
function exportCSV() {
  let csvData = "Active,Bright,Warm,Wet,Sugary,Acid,Noisy,Harmonious,H1,S1,V1,H2,S2,V2,H3,S3,V3,H4,S4,V4\n";
  data.forEach(entry => {
    let conceptVector = entry.concepts.join(",");
    let colorVector = entry.colors.map(c => c.map(v => v.toFixed(2)).join("-")).join(",");
    csvData += `${conceptVector},${colorVector}\n`;});
  
  const file = new Blob([csvData], { type: "text/csv" });
  const a = document.createElement('a');
  a.download = 'concepts_colors.csv';
  a.href = URL.createObjectURL(file);
  a.click();
}
// hh