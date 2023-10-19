require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const ejs = require('ejs');
const port = 8080;
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Assuming you're using multer for image upload

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.get('', (req, res) => {
  res.render("home");
});

// Configure Cloudinary with your API credentials
cloudinary.config({
  cloud_name:process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret:process.env.CLOUDINARY_SECRET
});


app.post('/upload-to-cloudinary', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.json({ success: false, error: 'No image uploaded' });
  }

  // Get the path to the uploaded image on the server
  const imageFile = req.file.path;

  // Upload the image to Cloudinary
  cloudinary.uploader.upload(imageFile, (error, result) => {
    if (error) {
      console.error('Error uploading to Cloudinary:', error);
      return res.json({ success: false, error: 'Error uploading to Cloudinary' });
    }

    // The image was successfully uploaded to Cloudinary, and `result` contains details about the uploaded image.
    console.log('Image uploaded to Cloudinary:', result);

    // You can save the image URL or other information to your database here.

    res.json({ success: true, imageUrl: result.secure_url });
  });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});