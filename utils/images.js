// const { createCanvas, loadImage } = require('canvas');
// import {createCanvas, loadImage, registerFont} from 'canvas';
// import {resolve} from 'path';
const { createCanvas, loadImage, registerFont } = require('canvas');
const { resolve } = require('path');

const ZERO = 0;
const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 800;

const LETTER_WIDTH = DEFAULT_WIDTH - 100;
const LETTER_HEIGHT = DEFAULT_HEIGHT - 140;
const LETTER_X = 50;
const LETTER_Y = 70;
const LINE_HEIGHT = 22;
const FONT_SIZE = 16;

const DEFAULT_TEXT = "Lorem 🥨 ipsum dolor sit amet, consectetur adipiscing elit. Etiam accumsan tempus dui, 🥘 eget venenatis elit dignissim id. Suspendisse eleifend venenatis tortor id congue. 🍬 Maecenas sed finibus tellus. Fusce🍬 🍬viverra sagittis libero, quis aliquam tortor facilisis ac. Nulla facilisi. Ut a hendrerit ligula. Curabitur id dolor non ligula egestas scelerisque id non leo. Maecenas commodo, arcu sed suscipit vehicula, velit nunc posuere massa, in imperdiet nunc purus non urna. Aliquam erat volutpat. Nulla id odio non diam malesuada commodo. Nulla id ligula nibh. Cras ultricies rhoncus ipsum id dapibus. Integer ut enim mi.\n" +
    "\n" +
    "Duis ullamcorper faucibus gravida. Aenean rutrum magna semper velit fringilla, in dignissim orci vestibulum. Fusce sit 🍬 amet mauris ligula. Duis lobortis, magna et molestie placerat, nibh tortor tempus erat, vitae varius dui turpis in dui. Suspendisse potenti. Curabitur posuere ullamcorper ipsum quis tincidunt. Nam aliquet bibendum urna. Phasellus id tellus sagittis, feugiat nisi sit amet, luctus justo. Suspendisse eget elit tempus, euismod mauris et, feugiat lectus. Praesent vel viverra massa, et pellentesque ipsum. Maecenas sit amet pulvinar orci, at pellentesque mi. Pellentesque eget mattis odio. Donec rutrum velit sit amet pulvinar posuere. In hac habitasse platea dictumst. Proin porttitor lobortis urna, id iaculis enim mollis eu."

// Assurez-vous que le chemin vers le fichier de police est correct
const FONT_PATH = resolve('fonts', 'open-dyslexic.ttf');
registerFont(FONT_PATH, {family: 'OpenDyslexic'} );
console.log('Font loaded !');

function createBaseImage(width, height) {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'white';
    ctx.fillRect(ZERO, ZERO, width, height);

    return canvas;
}

// Fonction pour écrire du texte sur le canevas avec gestion des retours à la ligne
function writeTextOnImage(ctx, text, x, y, maxWidth) {
    const lines = text.split('\n'); // Diviser le texte en lignes en fonction des sauts de ligne

    ctx.font = `${FONT_SIZE}px OpenDyslexic`;
    ctx.fillStyle = '#000';

    for (const line of lines) {
        const words = line.split(' ');
        let testLine = '';

        for (const word of words) {
            const newLine = testLine + word + ' ';
            const metrics = ctx.measureText(newLine);
            const testWidth = metrics.width;

            if (testWidth > maxWidth && testLine.length > 0) {
                ctx.fillText(testLine, x, y);
                testLine = word + ' ';
                y += LINE_HEIGHT; // Passer à la ligne suivante
            } else {
                testLine = newLine;
            }
        }
        ctx.fillText(testLine, x, y);
        y += LINE_HEIGHT; // Passer à la ligne suivante après avoir traité une ligne complète
    }
}

async function drawImage(ctx, imagePath, x, y, width, height) {
    const image = await loadImage(imagePath);
    ctx.drawImage(image, x, y, width, height);
}

async function createMyCustomImage(text, letterUrl, backgroundUrl) {
    const canvas = createBaseImage(DEFAULT_WIDTH, DEFAULT_HEIGHT);
    const ctx = canvas.getContext('2d');

    await drawImage(ctx, backgroundUrl, ZERO, ZERO, DEFAULT_WIDTH, DEFAULT_HEIGHT);
    await drawImage(ctx, letterUrl, LETTER_X, LETTER_Y, LETTER_WIDTH, LETTER_HEIGHT);

    writeTextOnImage(ctx, text, LETTER_X + 35, LETTER_Y + 55, LETTER_WIDTH - 100);

    return canvas;
}

module.exports = {
    createMyCustomImage: createMyCustomImage
}