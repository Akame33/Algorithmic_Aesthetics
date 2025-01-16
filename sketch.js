
let sliders = [];
let colors = [];
let data = [];


const numberColors = 4;
const numberConcepts = 8;
const conceptNames = ["Sugary", "Bitter", "Mild", "Acid", "Silent", "Noisy", "Harsh", "Harmonious"];

function setup() {
  createCanvas(650, (700));
  colorMode(HSL);

  for (let i = 0; i < numberConcepts; i++) {
    sliders.push(createSlider(0, 10, 5).position(30, 350 + i * 40)); // push sert à ajouter un nouvel élément (ici les sliders)

  }

  createButton("Generate colors").position(150, 700).mousePressed(generateColors);
  createButton("Export CSV file").position(300, 700).mousePressed(exportCSV);
  generateColors();
}

function draw() {
  background(240);

  // Les bandes de couleurs
  let stripeWidth = 500 / numberColors;
  for (let i = 0; i < colors.length; i++) {
    fill(colors[i]);
    noStroke();
    rect(i * stripeWidth + 40, 30, stripeWidth, 300);
  }

  // Les sliders et concept
  textSize(16);
  fill(30);
  for (let i = 0; i < 4; i++) {
    // Première colonne 
    text(`${conceptNames[i]}: ${sliders[i].value() / 10}`, 180, 405 + i * 40);
    sliders[i].position(30, 500 + i * 40);
  }

  for (let i = 4; i < 8; i++) {
    // Deuxième colonne
    text(`${conceptNames[i]}: ${sliders[i].value() / 10}`, 480, 405 + (i - 4) * 40);
    sliders[i].position(330, 500 + (i - 4) * 40);
  }
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

  saveData();
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

// Exporter les données dans un fichier CSV
function exportCSV() {
  let csvData = "Sugary,Bitter,Mild,Acid,Silent,Noisy,Harsh,Harmonious,H1,S1,V1,H2,S2,V2,H3,S3,V3,H4,S4,V4\n";
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
