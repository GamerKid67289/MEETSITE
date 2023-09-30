const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');

let localStream;
let peerConnection;

// Function to start the video chat
async function startVideoChat() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;

        const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
        peerConnection = new RTCPeerConnection(configuration);
        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

        peerConnection.onicecandidate = handleICECandidate;
        peerConnection.ontrack = handleTrack;

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        // Send the offer to the other user through your signaling server (not shown in this example)

    } catch (error) {
        console.error('Error starting video chat:', error);
    }
}

// Function to stop the video chat
function stopVideoChat() {
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
    }
    localVideo.srcObject = null;
    remoteVideo.srcObject = null;
    if (peerConnection) {
        peerConnection.close();
    }
}

// Function to handle ICE candidate events
function handleICECandidate(event) {
    // Send ICE candidate to the other user through your signaling server (not shown in this example)
}

// Function to handle incoming video tracks
function handleTrack(event) {
    remoteVideo.srcObject = event.streams[0];
}

// Add event listeners for buttons
startButton.addEventListener('click', startVideoChat);
stopButton.addEventListener('click', stopVideoChat);
