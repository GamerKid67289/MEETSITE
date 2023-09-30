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
    // Check if the user is authenticated (you would typically use a server for this)
    const isAuthenticated = true; // Change this to the result of your authentication check

    if (isAuthenticated) {
        loginContainer.style.display = 'none';
        videoContainer.style.display = 'block';

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

            // Create and exchange SDP offer/answer
            const offer = await rtcPeerConnection.createOffer();
            await rtcPeerConnection.setLocalDescription(offer);

            // Send the offer to the other user (You would typically use a signaling server here)
            // For simplicity, we'll just log the offer to the console
            console.log('SDP Offer:', offer);

            // Handle SDP answer from the other user (You would typically use a signaling server here)
            // For simplicity, we'll assume we received an answer and log it
            const answer = /* Received SDP Answer */;
            console.log('SDP Answer:', answer);

            // Set the remote description
            await rtcPeerConnection.setRemoteDescription(answer);
        } catch (error) {
            console.error('Error starting video chat:', error);
        }
    } else {
        alert('Authentication failed. Please check your username and password.');
    }
}

// Event listener for the login form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = usernameInput.value;
    const password = passwordInput.value;

    // Perform user authentication (you would typically use a server for this)
    // For simplicity, we'll mock authentication here
    if (username === 'demo' && password === 'password') {
        startVideoChat();
    } else {
        alert('Authentication failed. Please check your username and password.');
    }
});

startButton.addEventListener('click', startVideoChat);
