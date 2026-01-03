const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const imageInput = document.getElementById('imageInput');
const messageInput = document.getElementById('messageInput');
const statusDiv = document.getElementById('status');
const downloadSection = document.getElementById('downloadSection');
const downloadBtn = document.getElementById('downloadBtn');
const placeholder = document.getElementById('placeholder');

let originalImage = null;

// Handle Image Upload
imageInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            // UI Updates
            canvas.classList.remove('hidden');
            placeholder.classList.add('hidden');
            downloadSection.classList.add('hidden');
            originalImage = img;
            setStatus("IMAGE_LOADED_SUCCESSFULLY", "text-green-500");
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(file);
});

// Helper: Convert string to binary
function strToBin(str) {
    let bin = "";
    for (let i = 0; i < str.length; i++) {
        bin += str[i].charCodeAt(0).toString(2).padStart(8, '0');
    }
    return bin;
}

// Helper: Convert binary to string
function binToStr(bin) {
    let str = "";
    for (let i = 0; i < bin.length; i += 8) {
        str += String.fromCharCode(parseInt(bin.substr(i, 8), 2));
    }
    return str;
}

function encode() {
    if (!originalImage) {
        setStatus("ERROR: NO_SOURCE_IMAGE", "text-red-500");
        return;
    }

    const message = messageInput.value;
    if (message.length === 0) {
        setStatus("ERROR: EMPTY_PAYLOAD", "text-red-500");
        return;
    }

    // Add a terminator character to know when message ends (using null char)
    const binaryMessage = strToBin(message) + "00000000"; 
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    if (binaryMessage.length > data.length / 4) {
        setStatus("ERROR: MESSAGE_TOO_LARGE_FOR_IMAGE", "text-red-500");
        return;
    }

    // Steganography Logic: LSB (Least Significant Bit)
    let dataIndex = 0;
    for (let i = 0; i < binaryMessage.length; i++) {
        // Get the current pixel color value
        let val = data[dataIndex]; 
        
        // Modify the last bit to match our message bit
        // If message bit is 1, force pixel value to be odd. If 0, force even.
        if (binaryMessage[i] === '1') {
            val = val | 1; // OR 1 turns last bit to 1
        } else {
            val = val & ~1; // AND NOT 1 turns last bit to 0
        }
        
        data[dataIndex] = val;
        
        // Move to next channel (R -> G -> B -> A -> R...)
        dataIndex++;
        // Skip Alpha channel (every 4th byte) to avoid transparency issues
        if ((dataIndex + 1) % 4 === 0) {
            dataIndex++;
        }
    }

    ctx.putImageData(imgData, 0, 0);
    setStatus("ENCRYPTION_COMPLETE", "text-green-500");
    
    // Setup Download
    downloadBtn.href = canvas.toDataURL('image/png');
    downloadSection.classList.remove('hidden');
}

function decode() {
    if (!originalImage) {
        setStatus("ERROR: NO_SOURCE_IMAGE", "text-red-500");
        return;
    }

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    let binaryMessage = "";
    
    // Read the LSBs
    for (let i = 0; i < data.length; i++) {
        // Skip Alpha channel
        if ((i + 1) % 4 === 0) continue;

        // Extract last bit
        binaryMessage += (data[i] & 1).toString();
    }

    // Convert binary to text until we hit the null terminator (00000000)
    let output = "";
    for (let i = 0; i < binaryMessage.length; i += 8) {
        const byte = binaryMessage.substr(i, 8);
        if (byte === "00000000") {
            break; // Terminator found
        }
        output += String.fromCharCode(parseInt(byte, 2));
    }

    // Sanitize output to avoid crashing if garbage data is read
    try {
        messageInput.value = output;
        setStatus("DECRYPTION_SUCCESSFUL", "text-green-500");
    } catch (e) {
        setStatus("DECRYPTION_FAILED: CORRUPT_DATA", "text-red-500");
    }
}

function setStatus(msg, colorClass) {
    statusDiv.textContent = ">> " + msg;
    statusDiv.className = "text-xs font-bold " + colorClass;
}