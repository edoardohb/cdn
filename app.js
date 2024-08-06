const express = require('express');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs').promises;

const app = express();
const port = 3000;

app.get('/', (req, res) => {
	res.json({ message: 'Welcome' });
});

app.get('/*', async (req, res) => {
	const filePath = path.join(__dirname, 'public', req.params[0]);

	try {
		const width = parseInt(req.query.width);
		const height = parseInt(req.query.height);

		if (width || height) {
			const image = sharp(filePath);
			if (width && height) {
				image.resize(width, height);
			} else if (width) {
				image.resize(width);
			} else {
				image.resize({ height });
			}
			const buffer = await image.toBuffer();
			res.contentType(`image/${path.extname(filePath).slice(1)}`);
			res.send(buffer);
		} else {
			await fs.access(filePath);
			res.sendFile(filePath);
		}
	} catch (error) {
		res.status(404).send('File not found');
	}
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});