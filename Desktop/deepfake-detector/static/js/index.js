// This file handles the video upload and processing animations
document.addEventListener('DOMContentLoaded', function () {
    // DOM elements
    const uploadArea = document.querySelector('.upload-area');
    const analyzeButton = document.querySelector('.upload-area .cta-button');

    let fileInput = document.querySelector('input[type="file"]');
    if (!fileInput) {
        fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'video/*,image/*';
        fileInput.style.display = 'none';
        uploadArea.appendChild(fileInput);
    }

    // Prevent duplicate overlays
    let processingOverlay = document.querySelector('.processing-overlay');
    if (!processingOverlay) {
        processingOverlay = document.createElement('div');
        processingOverlay.className = 'processing-overlay';
        processingOverlay.innerHTML = `
            <div class="processing-spinner"></div>
            <div class="processing-status">Initializing...</div>
            <div class="progress-container">
                <div class="progress-bar"></div>
            </div>
        `;
        document.body.appendChild(processingOverlay);
        processingOverlay.style.display = 'none'; // Initially hide
    }

    // Drag and Drop functionality
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        handleFiles(e.dataTransfer.files);
    });

    // Click to upload
    uploadArea.addEventListener('click', function (e) {
        if (e.target !== analyzeButton) {
            fileInput.click();
        }
    });

    fileInput.addEventListener('change', function () {
        if (this.files.length) {
            handleFiles(this.files);
        }
    });

    // Analyze button
    analyzeButton.addEventListener('click', function () {
        const selectedFile = document.querySelector('.selected-file');
        if (selectedFile) {
            processVideo();
        } else {
            fileInput.click();
        }
    });

    // Handle the selected files
    function handleFiles(files) {
        if (files.length) {
            const file = files[0];
            displaySelectedFile(file);
            analyzeButton.textContent = 'Analyze This Media';
        }
    }

    // Display the selected file
    function displaySelectedFile(file) {
        // Remove any previously selected file display
        const existingPreview = document.querySelector('.selected-file');
        if (existingPreview) {
            existingPreview.remove();
        }

        // Create preview container
        const previewContainer = document.createElement('div');
        previewContainer.className = 'selected-file';

        // Add file name
        const fileName = document.createElement('p');
        fileName.className = 'file-name';
        fileName.textContent = file.name;

        previewContainer.appendChild(fileName);

        // If it's an image, show preview
        if (file.type.startsWith('image/')) {
            const preview = document.createElement('img');
            preview.className = 'file-preview';

            const reader = new FileReader();
            reader.onload = function (e) {
                preview.src = e.target.result;
            };
            reader.readAsDataURL(file);

            previewContainer.appendChild(preview);
        }
        // If it's a video, show video preview
        else if (file.type.startsWith('video/')) {
            const preview = document.createElement('video');
            preview.className = 'file-preview';
            preview.controls = true;

            const reader = new FileReader();
            reader.onload = function (e) {
                preview.src = e.target.result;
            };
            reader.readAsDataURL(file);

            previewContainer.appendChild(preview);
        }

        // Add remove button
        const removeButton = document.createElement('button');
        removeButton.className = 'remove-file';
        removeButton.innerHTML = '<i class="fas fa-times"></i>';
        removeButton.addEventListener('click', function (e) {
            e.stopPropagation();
            previewContainer.remove();
            analyzeButton.textContent = 'Analyze Media';
        });

        previewContainer.appendChild(removeButton);

        // Add to upload area
        uploadArea.appendChild(previewContainer);

        // Update text
        const uploadText = document.querySelector('.upload-text h3');
        if (uploadText) {
            uploadText.textContent = 'File Selected';
        }
    }

    // Process the video and navigate to results page
    function processVideo() {
        const selectedFile = document.querySelector('.selected-file');
        if (!selectedFile) return;

        // Show processing overlay
        processingOverlay.style.display = 'flex';
        const statusText = processingOverlay.querySelector('.processing-status');
        const progressBar = processingOverlay.querySelector('.progress-bar');

        // Create FormData and append the file
        const formData = new FormData();
        const fileInput = document.querySelector('input[type="file"]');
        if (!fileInput.files[0]) {
            alert('Please select a file first');
            processingOverlay.style.display = 'none';
            return;
        }
        formData.append('file', fileInput.files[0]);

        // Send file to backend
        fetch('/api/analyze', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Analysis failed');
            }
            return response.json();
        })
        .then(results => {
            // Store results in sessionStorage
            sessionStorage.setItem('analysisResults', JSON.stringify(results));
            // Redirect to results page
            window.location.href = '/results';
        })
        .catch(error => {
            console.error('Error:', error);
            statusText.textContent = 'Error: ' + error.message;
            setTimeout(() => {
                processingOverlay.style.display = 'none';
            }, 2000);
        });

        // Update progress bar animation
        let progress = 0;
        const progressInterval = setInterval(() => {
            if (progress < 90) {
                progress += 10;
                progressBar.style.width = `${progress}%`;
            }
        }, 500);

        // Clear interval when leaving page
        window.addEventListener('beforeunload', () => {
            clearInterval(progressInterval);
        });
    }
});
