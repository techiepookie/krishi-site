// Simulate loading screen
window.addEventListener('load', function() {
    setTimeout(function() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.opacity = '0';
            setTimeout(function() {
                loadingOverlay.style.display = 'none';
            }, 500);
        }
    }, 2000);
});

// Navigation: Redirect "Analyze Another File" button to homepage via Flask route
document.querySelector('.secondary-button').addEventListener('click', function() {
    window.location.href = "/"; // Redirects to the Flask homepage
});

// File: results-handler.js - This code runs on your results page
document.addEventListener('DOMContentLoaded', function() {
    // Check if analysis results are stored in sessionStorage
    const resultsJSON = sessionStorage.getItem('analysisResults');
    if (!resultsJSON) {
        console.error('No analysis results found');
        // Redirect back to the homepage if no results are found
        window.location.href = "/";
        return;
    }
    
    // Parse the results JSON
    const results = JSON.parse(resultsJSON);
    
    // Hide the loading overlay if present
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 500);
    }
    
    // Update the UI with the analysis results
    updateResultsUI(results);
});

// Function to update the UI based on analysis results
function updateResultsUI(results) {
    // Update header and confidence level
    const resultTitle = document.querySelector('.result-title');
    const resultIcon = document.querySelector('.result-icon');
    const confidenceProgress = document.querySelector('.confidence-progress');
    const confidenceValue = document.querySelector('.confidence-label span:last-child');
    
    if (resultTitle && results.classification) {
        resultTitle.textContent = results.classification;
    }
    
    if (resultIcon && results.confidence !== undefined) {
        if (results.confidence > 75) {
            resultIcon.className = 'fas fa-exclamation-triangle result-icon fail';
        } else if (results.confidence > 40) {
            resultIcon.className = 'fas fa-exclamation-triangle result-icon uncertain';
        } else {
            resultIcon.className = 'fas fa-check-circle result-icon pass';
        }
    }
    
    if (confidenceProgress && results.confidence !== undefined) {
        const confidence = results.confidence;
        confidenceProgress.style.width = `${confidence}%`;
        
        if (confidence > 75) {
            confidenceProgress.className = 'confidence-progress high';
        } else if (confidence > 40) {
            confidenceProgress.className = 'confidence-progress medium';
        } else {
            confidenceProgress.className = 'confidence-progress low';
        }
    }
    
    if (confidenceValue && results.confidence !== undefined) {
        confidenceValue.textContent = `${Math.round(results.confidence)}%`;
    }
    
    // Update video/image preview and heatmap in the video container
    const videoContainer = document.querySelector('.video-container');
    if (videoContainer) {
        // Check if we have original image/frame data
        if (results.original_frame || results.original_image) {
            const originalContainer = videoContainer.querySelector('.video-preview');
            if (originalContainer) {
                const imgData = results.original_frame || results.original_image;
                originalContainer.innerHTML = `
                    <span class="preview-label">Original Upload</span>
                    <img src="data:image/png;base64,${imgData}" alt="Original media" width="100%">
                `;
            }
            
            // Update the heatmap image if available
            const heatmapContainer = videoContainer.querySelector('.heatmap-preview');
            if (heatmapContainer) {
                const heatmapData = results.heatmap_frame || results.heatmap_image;
                heatmapContainer.innerHTML = `
                    <span class="preview-label">Detection Heatmap</span>
                    <img src="data:image/png;base64,${heatmapData}" alt="Deepfake detection heatmap" width="100%">
                `;
            }
        }
    }
    
    // Update the details section if available
    if (results.details) {
        updateDetailsSection(results.details);
    }
    
    // Update the analysis sections if available
    if (results.analysis_sections) {
        updateAnalysisSections(results.analysis_sections);
    }
}

// Function to update the details section
function updateDetailsSection(details) {
    const detailsContainer = document.querySelector('.result-details');
    if (!detailsContainer) return;
    
    let detailsHTML = `<h3 class="details-title">Analysis Details</h3>`;
    
    for (const [key, value] of Object.entries(details)) {
        const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        detailsHTML += `
            <div class="detail-item">
                <div class="detail-label">${formattedKey}</div>
                <div class="detail-value">${value}</div>
            </div>
        `;
    }
    
    detailsContainer.innerHTML = detailsHTML;
}

// Function to update analysis sections
function updateAnalysisSections(sections) {
    const analysisContainer = document.querySelector('.analysis-sections');
    if (!analysisContainer) return;
    
    // Clear any existing analysis cards
    analysisContainer.innerHTML = '';
    
    for (const [key, data] of Object.entries(sections)) {
        // Choose the appropriate icon for the analysis type
        let icon = 'fa-question';
        if (key === 'facial_analysis') icon = 'fa-face-smile';
        else if (key === 'frequency_analysis') icon = 'fa-wave-square';
        else if (key === 'audio_visual_sync') icon = 'fa-volume-high';
        else if (key === 'lighting_consistency') icon = 'fa-lightbulb';
        
        // Format the title
        const title = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        // Set the indicator class based on the status
        let indicatorClass = 'indicator-warning';
        if (data.status === 'pass') indicatorClass = 'indicator-pass';
        else if (data.status === 'fail') indicatorClass = 'indicator-fail';
        
        const card = document.createElement('div');
        card.className = 'analysis-card';
        card.innerHTML = `
            <h3 class="analysis-card-title">
                <i class="fas ${icon}"></i> ${title}
            </h3>
            <div class="analysis-card-content">
                <p>${data.description}</p>
                <div class="analysis-result">
                    <span class="result-indicator ${indicatorClass}"></span>
                    <span>${data.status === 'pass' ? 'Normal' : data.status === 'warning' ? 'Suspicious' : 'Abnormal'}</span>
                </div>
            </div>
        `;
        
        analysisContainer.appendChild(card);
    }
}
