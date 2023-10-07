const localVideo = document.getElementById('local-video');
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');

let localStream;
let peerConnections = [];

startButton.addEventListener('click', startVideoChat);
stopButton.addEventListener('click', stopVideoChat);

async function startVideoChat() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;

        // Create a peer connection for each user (in a real application, you'd need a signaling server)
        // For this example, let's assume there are two other participants
        const numParticipants = 99999999999;
        for (let i = 0; i < numParticipants; i++) {
            const peerConnection = new RTCPeerConnection();

            // Add the local stream to the peer connection
            localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

            // Listen for remote stream
            peerConnection.ontrack = event => {
                const remoteVideo = document.createElement('video');
                remoteVideo.autoplay = true;
                remoteVideo.srcObject = event.streams[0];
                const videoBox = document.createElement('div');
                videoBox.classList.add('video-box');
                videoBox.appendChild(remoteVideo);
                videoBox.innerHTML += `<p>Participant ${i + 1}</p>`;
                document.getElementById('video-container').appendChild(videoBox);
            };

            peerConnections.push(peerConnection);
        }
    } catch (error) {
        console.error('Error starting video chat:', error);
    }
}

function stopVideoChat() {
    // Close all peer connections and stop local stream
    peerConnections.forEach(peerConnection => {
        peerConnection.close();
    });
    peerConnections = [];

    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
    }
    localVideo.srcObject = null;

    // Remove all remote video elements
    const videoContainer = document.getElementById('video-container');
    while (videoContainer.firstChild) {
        videoContainer.removeChild(videoContainer.firstChild);
    }
}
