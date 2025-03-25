function switchTab(tab) {
    const encodeSection = document.getElementById("encode-section");
    const decodeSection = document.getElementById("decode-section");
    const tabs = document.querySelectorAll(".tab");

    tabs.forEach(t => t.classList.remove("active"));
    event.target.classList.add("active");

    if (tab === "encode") {
        encodeSection.style.display = "block";
        decodeSection.style.display = "none";
    } else {
        encodeSection.style.display = "none";
        decodeSection.style.display = "block";
    }

    // Clear outputs on tab switch
    clearOutputs();
}

function clearOutputs() {
    const textOutput = document.getElementById("text-output");
    const imageOutput = document.getElementById("image-output");
    const videoOutput = document.getElementById("video-output");
    const copyBtn = document.querySelector(".copy-btn");
    textOutput.style.display = "none";
    imageOutput.style.display = "none";
    videoOutput.style.display = "none";
    copyBtn.style.display = "none";
    textOutput.value = "";
    imageOutput.src = "";
    videoOutput.src = "";
}

function encodeToBase64() {
    const fileInput = document.getElementById("file-input");
    const textInput = document.getElementById("text-input").value;
    const textOutput = document.getElementById("text-output");
    const imageOutput = document.getElementById("image-output");
    const videoOutput = document.getElementById("video-output");
    const copyBtn = document.querySelector(".copy-btn");

    clearOutputs();

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            const base64 = e.target.result.split(",")[1]; // Remove "data:..." prefix
            textOutput.value = base64;
            textOutput.style.display = "block";
            copyBtn.style.display = "block";
        };
        reader.readAsDataURL(file);
    } else if (textInput) {
        try {
            const base64 = btoa(textInput);
            textOutput.value = base64;
            textOutput.style.display = "block";
            copyBtn.style.display = "block";
        } catch (error) {
            textOutput.value = "Error: Invalid text for Base64 encoding.";
            textOutput.style.display = "block";
        }
    } else {
        textOutput.value = "Please upload a file or enter text.";
        textOutput.style.display = "block";
    }
}

function decodeFromBase64() {
    const base64Input = document.getElementById("base64-input").value;
    const textOutput = document.getElementById("text-output");
    const imageOutput = document.getElementById("image-output");
    const videoOutput = document.getElementById("video-output");
    const copyBtn = document.querySelector(".copy-btn");

    clearOutputs();

    if (!base64Input) {
        textOutput.value = "Please paste a Base64 string.";
        textOutput.style.display = "block";
        return;
    }

    try {
        // Try as video first (e.g., MP4, WebM)
        const videoTest = document.createElement("video");
        videoTest.onloadeddata = function() {
            videoOutput.src = `data:video/mp4;base64,${base64Input}`; // Try MP4 first
            videoOutput.style.display = "block";
        };
        videoTest.onerror = function() {
            // If not a video, try as image
            const imageTest = new Image();
            imageTest.onload = function() {
                imageOutput.src = `data:image/png;base64,${base64Input}`; // Try PNG first
                imageOutput.style.display = "block";
            };
            imageTest.onerror = function() {
                // If not an image, assume text
                try {
                    const decodedText = atob(base64Input);
                    textOutput.value = decodedText;
                    textOutput.style.display = "block";
                    copyBtn.style.display = "block";
                } catch (error) {
                    textOutput.value = "Error: Invalid Base64 string.";
                    textOutput.style.display = "block";
                }
            };
            imageTest.src = `data:image/png;base64,${base64Input}`;
        };
        videoTest.src = `data:video/mp4;base64,${base64Input}`;
    } catch (error) {
        textOutput.value = "Error: Invalid Base64 string.";
        textOutput.style.display = "block";
    }
}

function copyOutput() {
    const textOutput = document.getElementById("text-output");
    const feedback = document.getElementById("copy-feedback");

    if (textOutput.value && textOutput.style.display !== "none") {
        navigator.clipboard.writeText(textOutput.value);
        feedback.style.display = "block";
        setTimeout(() => {
            feedback.style.display = "none";
        }, 2000);
    }
}
