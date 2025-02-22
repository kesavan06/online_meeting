let screenStream;
let mediaRecorder;
let recordedChunks = [];

export async function startScreenRecording() {
    try {
        screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });

        document.getElementById("screen-video").srcObject = screenStream;

        mediaRecorder = new MediaRecorder(screenStream, { mimeType: "video/webm" });

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = stopScreenRecording;

        mediaRecorder.start();
        console.log("Recording started...");
    } catch (error) {
        console.error("Error starting screen recording:", error);
    }
}

export function stopScreenRecording() {
    console.log("Inside the stop recording");
    // console.log("media: "+mediaRecorder.state);
    // if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
        console.log("Recording stopped...");
    // }
}

function saveRecording() {
    const recordedBlob = new Blob(recordedChunks, { type: "video/webm" });

    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(recordedBlob);
    downloadLink.download = "screen-recording.webm";
    downloadLink.click();

    console.log("Recording saved.");
}

