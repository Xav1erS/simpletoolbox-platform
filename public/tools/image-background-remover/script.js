/**
 * AI Image Background Remover - Main Script
 * Powered by rembg-web & ONNX Runtime
 */

// Global state
let appState = {
    originalImage: null,
    processedImage: null,
    session: null,
    modelLoaded: false,
    processing: false
};

// DOM elements
const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const processBtn = document.getElementById('processBtn');
const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');
const statusText = document.getElementById('statusText');
const resultsSection = document.getElementById('resultsSection');
const originalPreview = document.getElementById('originalPreview');
const processedPreview = document.getElementById('processedPreview');
const downloadBtn = document.getElementById('downloadBtn');
const modelSelect = document.getElementById('modelSelect');
const backgroundSelect = document.getElementById('backgroundSelect');
const customColorContainer = document.getElementById('customColorContainer');
const customColorPicker = document.getElementById('customColorPicker');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    initBackgroundSelector();
    loadDefaultModel();
    initEnhancements();
});

// Event listeners
function initEventListeners() {
    // File input change
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            handleFileSelect();
        }
    });
    
    // Model selection
    modelSelect.addEventListener('change', function() {
        if (appState.session) {
            appState.session = null;
        }
        loadModel(this.value);
    });
    
    // Background selection
    backgroundSelect.addEventListener('change', function() {
        if (this.value === 'custom') {
            customColorContainer.style.display = 'block';
        } else {
            customColorContainer.style.display = 'none';
        }
    });
}

// Background selector
function initBackgroundSelector() {
    // Custom color picker visibility
    backgroundSelect.addEventListener('change', function() {
        customColorContainer.style.display = this.value === 'custom' ? 'block' : 'none';
    });
}

// Load default model (u2netp)
async function loadDefaultModel() {
    try {
        showStatus('Loading AI model...', 'info');
        // Configure rembg-web to use Hugging Face hosted models (dev only)
        if (typeof rembgWeb !== 'undefined' && rembgWeb.rembgConfig) {
            rembgWeb.rembgConfig.setBaseUrl('https://huggingface.co/bunnio/dis_anime/resolve/main');
        }
        // Load the selected model
        await loadModel(modelSelect.value);
    } catch (error) {
        console.error('Failed to load default model:', error);
        showStatus('Failed to load AI model. Using fallback simulation.', 'error');
        // Fallback to simulation mode
        appState.modelLoaded = true;
    }
}

// Load specific model
async function loadModel(modelName) {
    try {
        showStatus(`Loading ${modelName} model...`, 'info');
        
        // Check if rembgWeb is available
        if (typeof rembgWeb === 'undefined') {
            throw new Error('rembg-web library not loaded');
        }
        
        // Create a new session with the selected model
        const session = await rembgWeb.newSession(modelName);
        appState.session = session;
        appState.modelLoaded = true;
        
        showStatus('AI model loaded successfully!', 'success');
        updateProcessButton();
    } catch (error) {
        console.error('Model loading error:', error);
        showStatus(`Failed to load ${modelName}. Using fallback simulation.`, 'error');
        // Fallback to simulation
        appState.modelLoaded = true;
        appState.session = null;
    }
}

// Handle file selection
function handleFileSelect() {
    const file = fileInput.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.match('image.*')) {
        showStatus('Please select an image file (JPG, PNG, WebP).', 'error');
        return;
    }
    
    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
        showStatus('Image size must be less than 10MB.', 'error');
        return;
    }
    
    // Read and preview the image
    const reader = new FileReader();
    reader.onload = function(e) {
        const imgUrl = e.target.result;
        appState.originalImage = imgUrl;
        originalPreview.src = imgUrl;
        
        // Enable process button
        updateProcessButton();
        
        // Hide previous results
        resultsSection.style.display = 'none';
        
        showStatus('Image uploaded successfully. Ready to process.', 'success');
    };
    reader.readAsDataURL(file);
}

// Update process button state
function updateProcessButton() {
    const hasImage = appState.originalImage !== null;
    const isReady = appState.modelLoaded && !appState.processing;
    processBtn.disabled = !(hasImage && isReady);
    processBtn.innerHTML = appState.processing ? 
        '<i class="fas fa-spinner fa-spin me-2"></i>Processing...' :
        '<i class="fas fa-bolt me-2"></i>Remove Background';
}

// Show status message
function showStatus(message, type = 'info') {
    statusText.textContent = message;
    statusText.className = 'text-center mt-2 small';
    
    switch (type) {
        case 'success':
            statusText.classList.add('text-success');
            break;
        case 'error':
            statusText.classList.add('text-danger');
            break;
        case 'info':
            statusText.classList.add('text-info');
            break;
        case 'warning':
            statusText.classList.add('text-warning');
            break;
    }
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            if (statusText.textContent === message) {
                statusText.textContent = '';
            }
        }, 5000);
    }
}

// Process image
async function processImage() {
    if (!appState.originalImage || appState.processing) return;
    
    // Reset previous results
    appState.processedImage = null;
    processedPreview.src = '';
    
    // Show progress
    progressContainer.style.display = 'block';
    progressBar.style.width = '0%';
    progressBar.classList.remove('bg-success', 'bg-danger');
    progressBar.classList.add('bg-primary');
    
    appState.processing = true;
    updateProcessButton();
    
    // Show skeleton loading screen and start countdown
    showSkeleton();
    startCountdown();
    
    try {
        showStatus('Starting background removal...', 'info');
        updateProgress(10);
        
        // Get the selected background option
        const bgOption = backgroundSelect.value;
        let bgColor = null;
        
        if (bgOption === 'white') {
            bgColor = [255, 255, 255, 255];
        } else if (bgOption === 'black') {
            bgColor = [0, 0, 0, 255];
        } else if (bgOption === 'custom') {
            const hex = customColorPicker.value;
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            bgColor = [r, g, b, 255];
        }
        // For transparent, bgColor remains null
        
        updateProgress(30);
        
        // Get the file
        const file = fileInput.files[0];
        
        // Use AI model if loaded, otherwise use simulation
        let resultBlob;
        if (appState.session) {
            showStatus('Running AI model...', 'info');
            updateProgress(50);
            
            const options = {};
            if (bgColor) {
                options.bgcolor = bgColor;
            }
            
            // Call rembg-web remove function
            resultBlob = await rembgWeb.remove(file, options);
            updateProgress(80);
        } else {
            // Simulation mode (simple color-based removal)
            showStatus('Simulating background removal...', 'info');
            resultBlob = await simulateBackgroundRemoval(file, bgColor);
            updateProgress(80);
        }
        
        // Create object URL for preview
        const resultUrl = URL.createObjectURL(resultBlob);
        appState.processedImage = resultUrl;
        processedPreview.src = resultUrl;
        
        updateProgress(100);
        showStatus('Background removal completed!', 'success');
        
        // Show results section
        resultsSection.style.display = 'block';
        
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
    } catch (error) {
        console.error('Processing error:', error);
        progressBar.classList.remove('bg-primary');
        progressBar.classList.add('bg-danger');
        showStatus(`Processing failed: ${error.message}`, 'error');
        
        // Fallback simulation
        try {
            showStatus('Trying fallback simulation...', 'warning');
            const file = fileInput.files[0];
            const bgColor = backgroundSelect.value === 'transparent' ? null : [255, 255, 255, 255];
            const resultBlob = await simulateBackgroundRemoval(file, bgColor);
            const resultUrl = URL.createObjectURL(resultBlob);
            appState.processedImage = resultUrl;
            processedPreview.src = resultUrl;
            resultsSection.style.display = 'block';
            showStatus('Fallback simulation completed.', 'success');
        } catch (fallbackError) {
            console.error('Fallback error:', fallbackError);
            showStatus('All processing methods failed. Please try another image.', 'error');
        }
    } finally {
        appState.processing = false;
        updateProcessButton();
        // Stop countdown and hide skeleton
        stopCountdown();
        hideSkeleton();
        // Hide progress bar after a delay
        setTimeout(() => {
            progressContainer.style.display = 'none';
        }, 2000);
    }
}

// Update progress bar
function updateProgress(percent) {
    progressBar.style.width = percent + '%';
    progressBar.setAttribute('aria-valuenow', percent);
}

// Simulate background removal (fallback)
function simulateBackgroundRemoval(file, bgColor) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();
        
        reader.onload = function(e) {
            img.onload = function() {
                // Create canvas
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                
                // Draw original image
                ctx.drawImage(img, 0, 0);
                
                // Get image data
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                
                // Simple simulation: remove white-ish background
                // This is just a placeholder - real AI model would do proper segmentation
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    
                    // If pixel is close to white, make it transparent
                    const isLight = (r + g + b) / 3 > 200;
                    if (isLight) {
                        data[i + 3] = 0; // Set alpha to 0 (transparent)
                    }
                    
                    // If a custom background color is specified, apply it to transparent pixels
                    if (bgColor && data[i + 3] === 0) {
                        data[i] = bgColor[0];
                        data[i + 1] = bgColor[1];
                        data[i + 2] = bgColor[2];
                        data[i + 3] = bgColor[3];
                    }
                }
                
                ctx.putImageData(imageData, 0, 0);
                
                // Convert to blob
                canvas.toBlob(blob => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Canvas to blob conversion failed'));
                    }
                }, 'image/png');
            };
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Download result
function downloadResult() {
    if (!appState.processedImage) return;
    
    const link = document.createElement('a');
    link.href = appState.processedImage;
    link.download = 'background-removed-' + Date.now() + '.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showStatus('Download started!', 'success');
}

// Reset tool
function resetTool() {
    // Reset file input
    fileInput.value = '';
    
    // Reset state
    appState.originalImage = null;
    appState.processedImage = null;
    
    // Reset UI
    originalPreview.src = '';
    processedPreview.src = '';
    resultsSection.style.display = 'none';
    processBtn.disabled = true;
    statusText.textContent = '';
    
    showStatus('Tool reset. Upload a new image.', 'info');
}

// Utility: format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Show skeleton loading screen
function showSkeleton() {
    const skeletonContainer = document.getElementById('skeletonContainer');
    const resultsSection = document.getElementById('resultsSection');
    if (skeletonContainer && resultsSection) {
        resultsSection.style.display = 'block';
        skeletonContainer.style.display = 'block';
        // Hide result rows initially
        document.querySelectorAll('#resultsSection .row').forEach(row => {
            if (!row.closest('#skeletonContainer')) {
                row.style.display = 'none';
            }
        });
    }
}

// Hide skeleton and show results
function hideSkeleton() {
    const skeletonContainer = document.getElementById('skeletonContainer');
    if (skeletonContainer) {
        skeletonContainer.style.display = 'none';
    }
    // Show result rows
    document.querySelectorAll('#resultsSection .row').forEach(row => {
        if (!row.closest('#skeletonContainer')) {
            row.style.display = '';
        }
    });
}

// Start countdown timer
let countdownInterval = null;
let timeoutTimer = null;

function startCountdown() {
    let seconds = 10;
    const countdownElement = document.getElementById('countdownSeconds');
    if (countdownElement) {
        countdownElement.textContent = seconds;
    }
    
    countdownInterval = setInterval(() => {
        seconds--;
        if (countdownElement) {
            countdownElement.textContent = seconds;
        }
        if (seconds <= 0) {
            clearInterval(countdownInterval);
            showTimeoutModal();
        }
    }, 1000);
    
    // Set timeout for 10 seconds
    timeoutTimer = setTimeout(() => {
        if (appState.processing) {
            showTimeoutModal();
        }
    }, 10000);
}

// Stop countdown
function stopCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
    if (timeoutTimer) {
        clearTimeout(timeoutTimer);
        timeoutTimer = null;
    }
}

// Show timeout modal
function showTimeoutModal() {
    const modal = document.getElementById('timeoutModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

// Close timeout modal
function closeTimeoutModal() {
    const modal = document.getElementById('timeoutModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Retry processing
function retryProcessing() {
    closeTimeoutModal();
    stopCountdown();
    // Reset processing state and retry
    appState.processing = false;
    updateProcessButton();
    setTimeout(() => {
        processImage();
    }, 500);
}

// Batch upload functionality
let batchFiles = [];

function initBatchUpload() {
    const batchArea = document.getElementById('batchUploadArea');
    const batchInput = document.getElementById('batchFileInput');
    
    if (!batchArea || !batchInput) return;
    
    batchArea.addEventListener('click', () => batchInput.click());
    
    batchArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        batchArea.classList.add('dragover');
    });
    
    batchArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        batchArea.classList.remove('dragover');
    });
    
    batchArea.addEventListener('drop', (e) => {
        e.preventDefault();
        batchArea.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            handleBatchFiles(e.dataTransfer.files);
        }
    });
    
    batchInput.addEventListener('change', () => {
        if (batchInput.files.length) {
            handleBatchFiles(batchInput.files);
        }
    });
}

function handleBatchFiles(fileList) {
    const validFiles = Array.from(fileList).filter(file => 
        file.type.match('image.*') && file.size <= 10 * 1024 * 1024
    );
    
    if (validFiles.length === 0) {
        showStatus('No valid image files selected.', 'error');
        return;
    }
    
    batchFiles = validFiles;
    updateBatchFilesList();
    showStatus(`${validFiles.length} images added for batch processing.`, 'success');
}

function updateBatchFilesList() {
    const listContainer = document.getElementById('batchFilesList');
    if (!listContainer) return;
    
    listContainer.innerHTML = '';
    
    batchFiles.forEach((file, index) => {
        const div = document.createElement('div');
        div.className = 'd-flex justify-content-between align-items-center border-bottom py-2';
        div.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas fa-file-image me-2 text-primary"></i>
                <span class="small">${file.name} (${formatFileSize(file.size)})</span>
            </div>
            <button class="btn btn-sm btn-outline-danger" onclick="removeBatchFile(${index})">
                <i class="fas fa-times"></i>
            </button>
        `;
        listContainer.appendChild(div);
    });
}

function removeBatchFile(index) {
    batchFiles.splice(index, 1);
    updateBatchFilesList();
}

async function processBatch() {
    if (batchFiles.length === 0) {
        showStatus('No images to process.', 'error');
        return;
    }
    
    showSkeleton();
    startCountdown();
    
    try {
        // Process each image
        const processedBlobs = [];
        for (let i = 0; i < batchFiles.length; i++) {
            const file = batchFiles[i];
            updateProgress(Math.floor((i / batchFiles.length) * 100));
            
            let resultBlob;
            if (appState.session) {
                resultBlob = await rembgWeb.remove(file);
            } else {
                resultBlob = await simulateBackgroundRemoval(file, null);
            }
            processedBlobs.push({
                blob: resultBlob,
                name: file.name.replace(/\.[^/.]+$/, '') + '_nobg.png'
            });
        }
        
        stopCountdown();
        hideSkeleton();
        
        // Create ZIP file
        const zip = new JSZip();
        processedBlobs.forEach(item => {
            zip.file(item.name, item.blob);
        });
        
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const zipUrl = URL.createObjectURL(zipBlob);
        
        // Create download link
        const link = document.createElement('a');
        link.href = zipUrl;
        link.download = `background-removed-batch-${Date.now()}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showStatus(`Batch processing completed! Downloaded ${batchFiles.length} images.`, 'success');
        
    } catch (error) {
        console.error('Batch processing error:', error);
        stopCountdown();
        hideSkeleton();
        showStatus(`Batch processing failed: ${error.message}`, 'error');
    }
}

// User retention functionality
function initRetention() {
    const bookmarkBtn = document.getElementById('bookmarkBtn');
    const shareBtn = document.getElementById('shareBtn');
    const floatingContainer = document.getElementById('retentionFloating');
    
    if (bookmarkBtn) {
        bookmarkBtn.addEventListener('click', addToBookmarks);
    }
    
    if (shareBtn) {
        shareBtn.addEventListener('click', shareTool);
    }
    
    // Show floating buttons when processing completes
    // This will be called from processImage success
}

function addToBookmarks() {
    const title = document.title;
    const url = window.location.href;
    
    if (window.sidebar && window.sidebar.addPanel) {
        // Firefox
        window.sidebar.addPanel(title, url, '');
    } else if (window.external && ('AddFavorite' in window.external)) {
        // IE
        window.external.AddFavorite(url, title);
    } else {
        // Modern browsers
        alert(`Press ${navigator.userAgent.toLowerCase().indexOf('mac') !== -1 ? 'Cmd+D' : 'Ctrl+D'} to bookmark this page.`);
    }
}

function shareTool() {
    const title = 'AI Image Background Remover';
    const url = window.location.href;
    const text = 'Check out this free AI tool to remove backgrounds from images instantly!';
    
    if (navigator.share) {
        navigator.share({
            title: title,
            text: text,
            url: url
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(`${text} ${url}`).then(() => {
            showStatus('Link copied to clipboard!', 'success');
        });
    }
}

// Email subscription
function subscribeNewsletter() {
    const emailInput = document.getElementById('subscribeEmail');
    const email = emailInput.value.trim();
    
    if (!email || !email.includes('@')) {
        showStatus('Please enter a valid email address.', 'error');
        return;
    }
    
    // Simulate subscription (in real implementation, send to backend)
    showStatus('Subscribed successfully! Thank you.', 'success');
    emailInput.value = '';
    
    // Hide subscription module after success
    const subscriptionModule = document.getElementById('emailSubscription');
    if (subscriptionModule) {
        subscriptionModule.style.display = 'none';
    }
}

// Mobile camera upload
function initCameraUpload() {
    const cameraBtn = document.getElementById('cameraUploadBtn');
    const cameraInput = document.getElementById('cameraInput');
    
    if (!cameraBtn || !cameraInput) return;
    
    cameraBtn.addEventListener('click', () => cameraInput.click());
    
    cameraInput.addEventListener('change', () => {
        if (cameraInput.files.length) {
            handleFileSelect(); // Use existing file handling
        }
    });
}

// Initialize all enhancements
function initEnhancements() {
    initBatchUpload();
    initRetention();
    initCameraUpload();
    
    // Update page title and H1 for SEO
    document.title = 'Free Background Remover - Remove Image Background Online | BgRemover';
    const h1 = document.querySelector('h1');
    if (h1) {
        h1.innerHTML = '<i class=\"fas fa-magic me-2\" style=\"color: var(--primary-color);\"></i>BgRemover <small class=\"fs-5 text-muted\">AI-Powered, 100% Free, No Sign-Up Required</small>';
    }
    
    // Move ad container to bottom of results section
    const adContainerTop = document.querySelector('.container .ad-container');
    const resultsSection = document.getElementById('resultsSection');
    if (adContainerTop && resultsSection) {
        // Clone and move
        const clonedAd = adContainerTop.cloneNode(true);
        clonedAd.classList.add('mt-4');
        // Add guide text
        const guideText = document.createElement('div');
        guideText.className = 'ad-guide-text';
        guideText.innerHTML = 'Need to resize your image? Try our free image resizer →';
        clonedAd.insertBefore(guideText, clonedAd.firstChild);
        
        // Insert after results section
        resultsSection.parentNode.insertBefore(clonedAd, resultsSection.nextSibling);
        
        // Remove original top ad
        adContainerTop.remove();
    }
}

// Expose for debugging
window.appState = appState;