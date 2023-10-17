const video = document.getElementById("camera-feed");
const captureButton = document.getElementById("capture-button");
const imageCanvas = document.getElementById("image-canvas");
const imageGallery = document.getElementById("image-gallery");

let stream;
const constraints = {
    video: true
};

// Access the user's camera
navigator.mediaDevices.getUserMedia(constraints)
    .then(function (mediaStream) {
        video.srcObject = mediaStream;
        stream = mediaStream;
    })
    .catch(function (error) {
        console.error("Error accessing camera: " + error);
    });

// Function to fetch and render images from the server
function renderImages() {
    fetch('/get-images')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                imageGallery.innerHTML = '';
                data.images.forEach(image => {
                    // Include the full image URL with server hostname and port
                    const imageURL = 'http://localhost:3000/uploads/' + image;
                    
                    const imageElement = document.createElement('img');
                    imageElement.src = imageURL;
                    imageGallery.appendChild(imageElement);
                });
            }
        })
        .catch(error => {
            console.error("Error fetching images: " + error);
        });
}


// Capture and save an image
captureButton.addEventListener("click", function () {
    const context = imageCanvas.getContext('2d');
    imageCanvas.width = video.videoWidth;
    imageCanvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    // Convert the image to a Blob
    imageCanvas.toBlob(function (blob) {
        if (blob) {
            const formData = new FormData();
            formData.append('image', blob);

            // Send the captured image data to the server
            fetch('/save-image', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        renderImages(); // Refresh the gallery with the newly uploaded image
                    }
                })
                .catch(error => {
                    console.error("Error saving image: " + error);
                });
        }
    }, 'image/png');
});

// Release the camera when done
window.addEventListener('beforeunload', () => {
    stream.getTracks().forEach(track => track.stop());
});

// Initial rendering of images on page load
renderImages();


//app.use(express.static('public'));