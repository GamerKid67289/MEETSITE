const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
let localStream;
let remoteStream;
let peerConnection;

startButton.addEventListener('click', startVideoChat);
stopButton.addEventListener('click', stopVideoChat);

async function startVideoChat() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;

        const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
        peerConnection = new RTCPeerConnection(configuration);
        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

        peerConnection.onicecandidate = handleIceCandidate;
        peerConnection.ontrack = handleTrack;

        remoteStream = new MediaStream();
        remoteVideo.srcObject = remoteStream;

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        // You would send the offer to the remote party using a signaling server

    } catch (error) {
        console.error('Error starting video chat:', error);
    }
}

function handleIceCandidate(event) {
    if (event.candidate) {
        // You would send the candidate to the remote party using a signaling server
    }
}

function handleTrack(event) {
    remoteStream.addTrack(event.track);
}

async function stopVideoChat() {
    localStream.getTracks().forEach(track => track.stop());
    localVideo.srcObject = null;
    remoteVideo.srcObject = null;

    if (peerConnection) {
        peerConnection.close();
    }
}
