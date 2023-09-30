const loginContainer = document.getElementById('login-container');
const videoContainer = document.getElementById('video-container');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const loginUsernameInput = document.getElementById('login-username');
const loginPasswordInput = document.getElementById('login-password');
const signupUsernameInput = document.getElementById('signup-username');
const signupPasswordInput = document.getElementById('signup-password');
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

            // Create and exchange SDP offer/answer (signaling not implemented in this example)
            const offer = await rtcPeerConnection.createOffer();
            await rtcPeerConnection.setLocalDescription(offer);

            // In a real application, you would send the offer to the other user via a signaling server
            // and handle the SDP answer accordingly

            console.log('SDP Offer:', offer);
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
    const username = loginUsernameInput.value;
    const password = loginPasswordInput.value;

    // Mock authentication (replace with server-based authentication)
    if (username === 'user' && password === 'password') {
        startVideoChat();
    } else {
        alert('Authentication failed. Please check your username and password.');
    }
});

// Event listener for the sign-up form submission
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = signupUsernameInput.value;
    const password = signupPasswordInput.value;

    // Mock user registration (replace with server-based registration)
    alert(`User "${username}" registered successfully.`);
    // You can add code here to save the user's information to a server or database

    // Automatically fill in the login form with the new user's credentials
    loginUsernameInput.value = username;
    loginPasswordInput.value = password;
});

startButton.addEventListener('click', startVideoChat);
