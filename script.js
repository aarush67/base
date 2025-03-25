function convertToBase64() {
    const fileInput = document.getElementById("file-input");
    const textInput = document.getElementById("text-input").value;
    const output = document.getElementById("output");

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            const base64 = e.target.result.split(",")[1]; // Remove "data:..." prefix
            output.value = base64;
        };
        reader.readAsDataURL(file);
    } else if (textInput) {
        try {
            const base64 = btoa(textInput);
            output.value = base64;
        } catch (error) {
            output.value = "Error: Invalid text for Base64 encoding.";
        }
    } else {
        output.value = "Please upload a file or enter text.";
    }
}

function copyOutput() {
    const output = document.getElementById("output");
    const feedback = document.getElementById("copy-feedback");

    if (output.value && output.value !== "Please upload a file or enter text.") {
        navigator.clipboard.writeText(output.value);
        feedback.style.display = "block";
        setTimeout(() => {
            feedback.style.display = "none";
        }, 2000);
    }
}
