const express = require('express');
const multer = require('multer');
const { writePsdBuffer } = require('ag-psd');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const sizeOf = require('image-size');
const { createCanvas, Image } = require('canvas');

const app = express();
const upload = multer({ dest: 'uploads/' });
app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/test', (req, res) => {
    res.send('Test route');
});

app.post('/upload', upload.array('images'), async (req, res) => {

    try {
        const files = req.files;

        if (!files || files.length === 0) {
            return res.status(400).send('No files uploaded');
        }


        // Ensure the output directory exists
        const outputDir = path.join(__dirname, 'output');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const layers = files.map((file) => {
            const dimension = sizeOf(file.path);
            const buffer = fs.readFileSync(file.path);

            // create canvas
            const canvas = createCanvas(dimension.width, dimension.height);
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.src = buffer;
            ctx.drawImage(img, 0, 0);

            return {
                name: path.basename(file.originalname, path.extname(file.originalname)),
                canvas: canvas,
                width: dimension.width,
                height: dimension.height,
            };
        });

        // Calculate max width and height
        const maxWidth = Math.max(...layers.map(layer => layer.width));
        const maxHeight = Math.max(...layers.map(layer => layer.height));

        const psd = {
            width: maxWidth,
            height: maxHeight,
            children: layers.map((layer, i) => ({
                name: layer.name,
                top: 0,
                left: 0,
                canvas: layer.canvas,
            })),
        };

        const psdBuffer = writePsdBuffer(psd);
        const outputPath = path.join(__dirname, 'output', 'output.psd');
        fs.writeFileSync(outputPath, psdBuffer);

        // Cleanup
        files.forEach((file) => fs.unlinkSync(file.path));

        res.download(outputPath, 'output.psd', (err) => {
            if (err) console.error(err);
            fs.unlinkSync(outputPath);
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while processing images.');
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});