const { createCanvas, loadImage, registerFont } = require('canvas');
const { resolve } = require('path');
const GIFEncoder = require('gifencoder');
const decodeGif = require('decode-gif');
const axios = require('axios');

const ZERO = 0;
const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 800;

const LETTER_WIDTH = DEFAULT_WIDTH - 100;
const LETTER_HEIGHT = DEFAULT_HEIGHT - 140;
const LETTER_X = 50;
const LETTER_Y = 70;
const LINE_HEIGHT = 28;
const FONT_SIZE = 30;

const DEFAULT_TEXT = "Lorem 🥨 ipsum dolor sit amet, consectetur adipiscing elit. Etiam accumsan tempus dui, 🥘 eget venenatis elit dignissim id. Suspendisse eleifend venenatis tortor id congue. 🍬 Maecenas sed finibus tellus. Fusce🍬 🍬viverra sagittis libero, quis aliquam tortor facilisis ac. Nulla facilisi. Ut a hendrerit ligula. Curabitur id dolor non ligula egestas scelerisque id non leo. Maecenas commodo, arcu sed suscipit vehicula, velit nunc posuere massa, in imperdiet nunc purus non urna. Aliquam erat volutpat. Nulla id odio non diam malesuada commodo. Nulla id ligula nibh. Cras ultricies rhoncus ipsum id dapibus. Integer ut enim mi.\n" +
    "\n" +
    "Duis ullamcorper faucibus gravida. Aenean rutrum magna semper velit fringilla, in dignissim orci vestibulum. Fusce sit 🍬 amet mauris ligula. Duis lobortis, magna et molestie placerat, nibh tortor tempus erat, vitae varius dui turpis in dui. Suspendisse potenti. Curabitur posuere ullamcorper ipsum quis tincidunt. Nam aliquet bibendum urna. Phasellus id tellus sagittis, feugiat nisi sit amet, luctus justo. Suspendisse eget elit tempus, euismod mauris et, feugiat lectus. Praesent vel viverra massa, et pellentesque ipsum. Maecenas sit amet pulvinar orci, at pellentesque mi. Pellentesque eget mattis odio. Donec rutrum velit sit amet pulvinar posuere. In hac habitasse platea dictumst. Proin porttitor lobortis urna, id iaculis enim mollis eu.";

// const FONT_PATH_DYSLEXIC = resolve('fonts', 'open-dyslexic.ttf');
// registerFont(FONT_PATH_DYSLEXIC, { family: 'OpenDyslexic' });
// const FONT_PATH = resolve('fonts', 'journal.ttf');
// registerFont(FONT_PATH, { family: 'Journal' });
// const FONT_PATH = resolve('fonts', 'Vertically.otf');
// registerFont(FONT_PATH, { family: 'Vertically' });
const FONT_PATH = resolve('fonts', 'SimpleLetter.otf');
registerFont(FONT_PATH, { family: 'SimpleLetter' });
console.log('Font loaded !');

function createBaseImage(width, height) {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'white';
    ctx.fillRect(ZERO, ZERO, width, height);

    return canvas;
}

function writeTextOnImage(ctx, text, color, x, y, maxWidth) {
    const lines = text.split('\n');

    ctx.font = `${FONT_SIZE}px SimpleLetter`;
    ctx.fillStyle = '#' + color;

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
                y += LINE_HEIGHT;
            } else {
                testLine = newLine;
            }
        }
        ctx.fillText(testLine, x, y);
        y += LINE_HEIGHT;
    }
}

async function drawImage(ctx, imagePath, x, y, width, height) {
    const image = await loadImage(imagePath);
    ctx.drawImage(image, x, y, width, height);
}

async function createMyCustomImage(text, color, letterUrl, backgroundUrl) {
    if (backgroundUrl.includes('.gif')) {
        return createGifWithText(text, color, letterUrl, backgroundUrl);
    } else {
        const canvas = createBaseImage(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        const ctx = canvas.getContext('2d');

        await drawImage(ctx, backgroundUrl, ZERO, ZERO, DEFAULT_WIDTH, DEFAULT_HEIGHT);
        await drawImage(ctx, letterUrl, LETTER_X, LETTER_Y, LETTER_WIDTH, LETTER_HEIGHT);

        writeTextOnImage(ctx, text, color, LETTER_X + 50, LETTER_Y + 160, LETTER_WIDTH - 105);

        return {
            attachment: canvas.toBuffer(),
            name: 'file.jpeg',
            contentType: 'image/jpeg'
        }
    }
}

async function getGifFrames(gifUrl) {
    try {
        // Fetch the GIF file from the remote URL
        const response = await axios.get(gifUrl, { responseType: 'arraybuffer' });
        const gifData = response.data;

        // Decode the GIF data
        const decodedGif = decodeGif(gifData);

        // Extract frames from the decoded GIF
        return decodedGif.frames.map(frame => {
            // Create a canvas for each frame
            const canvas = createCanvas(decodedGif.width, decodedGif.height);
            const ctx = canvas.getContext('2d');

            // Create an ImageData object from the frame data
            const imageData = ctx.createImageData(decodedGif.width, decodedGif.height);
            imageData.data.set(new Uint8ClampedArray(frame.data));

            // Put the ImageData onto the canvas
            ctx.putImageData(imageData, 0, 0);

            return canvas;
        });
    } catch (error) {
        console.error('Error fetching or decoding GIF:', error);
        throw error;
    }
}

async function createGifWithText(text, color, letterUrl, gifUrl) {
    const frames = await getGifFrames(gifUrl);
    const encoder = new GIFEncoder(DEFAULT_WIDTH, DEFAULT_HEIGHT);
    const stream = encoder.createReadStream();

    encoder.start();
    encoder.setRepeat(0); // 0 for repeat indefinitely
    encoder.setDelay(100); // Frame delay in ms
    encoder.setQuality(10); // Image quality. 10 is default.

    for (const frame of frames) {
        const canvas = createBaseImage(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(frame, ZERO, ZERO, DEFAULT_WIDTH, DEFAULT_HEIGHT);
        await drawImage(ctx, letterUrl, LETTER_X, LETTER_Y, LETTER_WIDTH, LETTER_HEIGHT);
        writeTextOnImage(ctx, text, color, LETTER_X + 35, LETTER_Y + 70, LETTER_WIDTH - 100);

        encoder.addFrame(ctx);
    }

    encoder.finish();

    // Collect the stream data into a buffer
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(chunk);
    }

    return {
        attachment: Buffer.concat(chunks),
        name: 'file.gif',
        contentType: 'image/gif'
    };
}

function computeMaxTextOnLetter(text) {
    const lines = text.split('\n');
    let maxLines = 0;

    const canvas = createBaseImage(DEFAULT_WIDTH, DEFAULT_HEIGHT);
    const ctx = canvas.getContext('2d');
    ctx.font = `${FONT_SIZE}px SimpleLetter`;

    for (const line of lines) {
        const words = line.split(' ');
        let testLine = '';

        for (const word of words) {
            const newLine = testLine + word + ' ';
            const metrics = ctx.measureText(newLine);
            const testWidth = metrics.width;

            if (testWidth > LETTER_WIDTH - 105 && testLine.length > 0) {
                maxLines++;
                testLine = word + ' ';
            } else {
                testLine = newLine;
            }
        }
        maxLines++;
    }

    return maxLines;
}

module.exports = {
    createMyCustomImage: createMyCustomImage,
    computeMaxTextOnLetter: computeMaxTextOnLetter
};
