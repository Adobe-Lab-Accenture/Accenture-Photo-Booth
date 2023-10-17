const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Only PNG files are allowed'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

app.get('/', (req, res) => {
    res.send("Welcome to the Camera Capture App");
});

// Handle file uploads
app.post('/save-image', upload.single('image'), (req, res) => {
    if (req.file) {
        res.json({ success: true });
    } else {
        res.json({ success: false, message: 'Failed to upload image' });
    }
});

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// New route to retrieve images from the 'uploads' folder
app.get('/get-images', (req, res) => {
    fs.readdir('uploads', (err, files) => {
        if (err) {
            res.json({ success: false, message: 'Error reading image directory' });
        } else {
            res.json({ success: true, images: files });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
