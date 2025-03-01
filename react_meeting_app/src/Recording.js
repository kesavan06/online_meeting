let screenStream;
let mediaRecorder;
let recordedChunks = [];
let screen = [];

export async function startRecord(stream) {
    try {
        // screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });

        // document.getElementById("screen-video").srcObject = screenStream;

        mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                console.log("Inside the if condition");
                recordedChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = stopRecord;

        mediaRecorder.start();
        console.log("Recording started...");
    } catch (error) {
        console.error("Error starting screen recording:", error);
    }
}

export function stopRecord() {
    console.log("Inside the stop recording");
    // console.log("media: "+mediaRecorder.state);
    // if (mediaRecorder && mediaRecorder.state !== "inactive") {
        // mediaRecorder.stop();
        // console.log("Recording stopped...");
    // }
    let total=recordedChunks.concat(screen);
    
    const recordedBlob = new Blob(total, { type: "video/webm" });

    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(recordedBlob);
    downloadLink.download = "screen-recording.webm";
    downloadLink.click();
    mediaRecorder.stop();
    console.log("Recording stopped...");
    
    console.log("Recording saved.");
}

export function startScreenRecord()
{
    try {
        mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                console.log("Inside the if condition");
                screen.push(event.data);
            }
        };
        mediaRecorder.onstop = stopRecord;

        mediaRecorder.start();
        console.log("Recording started...");
    } catch (error) {
        console.error("Error starting screen recording:", error);
    }
}

// export function saveRecording() {
//     const recordedBlob = new Blob(recordedChunks, { type: "video/webm" });

//     const downloadLink = document.createElement("a");
//     downloadLink.href = URL.createObjectURL(recordedBlob);
//     downloadLink.download = "screen-recording.webm";
//     downloadLink.click();

//     console.log("Recording saved.");
// }

