const loginContainer = document.getElementById('login-container');
const videoContainer = document.getElementById('video-container');
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const startButton = document.getElementById('startButton');
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

let localStream;
let remoteStream;
let rtcPeerConnection;

// Function to start the video chat
async function startVideoChat() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;

        rtcPeerConnection = new RTCPeerConnection();

        // Add local stream to the peer connection
        localStream.getTracks().forEach(track => rtcPeerConnection.addTrack(track, localStream));

        // Event listener for receiving remote stream
        rtcPeerConnection.ontrack = (event) => {
            remoteStream = event.streams[0];
            remoteVideo.srcObject = remoteStream;
        };

        // Create and exchange SDP offer/answer (signaling not implemented in this example)
        const offer = await rtcPeerConnection.createOffer();
        await rtcPeerConnection.setLocalDescription(offer);

        // In a real application, you would send the offer to the other user via a signaling server
        // and handle the SDP answer accordingly

        console.log('SDP Offer:', offer);
    } catch (error) {
        console.error('Error starting video chat:', error);
    }
}

// Event listener for the login form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = usernameInput.value;
    const password = passwordInput.value;

    // Mock authentication (replace with server-based authentication)
    if (username === 'user' && password === 'password') {
        loginContainer.style.display = 'none';
        videoContainer.style.display = 'block';
    } else {
        alert('Authentication failed. Please check your username and password.');
    }
});

startButton.addEventListener('click', startVideoChat);
