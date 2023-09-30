const usernameInput = document.getElementById('username');
const joinButton = document.getElementById('joinButton');
const videoContainer = document.getElementById('video-container');
const localVideo = document.getElementById('localVideo');
const remoteVideosContainer = document.getElementById('remoteVideosContainer');

let localStream;
let rtcPeerConnection;
let isInitiator = false;

// Function to set up the WebRTC connection
async function setUpWebRTC() {
    const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

    rtcPeerConnection = new RTCPeerConnection(configuration);

    // Add local stream to the peer connection
    localStream.getTracks().forEach(track => rtcPeerConnection.addTrack(track, localStream));

    // Event listener for receiving remote stream
    rtcPeerConnection.ontrack = (event) => {
        const remoteVideo = document.createElement('video');
        remoteVideo.autoplay = true;
        remoteVideo.srcObject = event.streams[0];
        remoteVideosContainer.appendChild(remoteVideo);
    };

    // Offer/answer exchange (signaling not implemented in this example)
    if (isInitiator) {
        const offer = await rtcPeerConnection.createOffer();
        await rtcPeerConnection.setLocalDescription(offer);
        // Send the offer to the other user via a signaling server
        console.log('SDP Offer:', offer);
    } else {
        // Handle receiving an offer from the other user via a signaling server
        // Set the remote description and create an answer
        // Send the answer back to the other user via the signaling server
    }
}

joinButton.addEventListener('click', async () => {
    const username = usernameInput.value;

    if (username) {
        videoContainer.style.display = 'block';

        try {
            localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localVideo.srcObject = localStream;
            isInitiator = true; // The first user to join becomes the initiator
            setUpWebRTC();
        } catch (error) {
            console.error('Error starting video chat:', error);
        }
    } else {
        alert('Please enter your name before joining the meeting.');
    }
});
