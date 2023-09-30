const usernameInput = document.getElementById('username');
const joinButton = document.getElementById('joinButton');
const videoContainer = document.getElementById('video-container');
const localVideo = document.getElementById('localVideo');
const remoteVideosContainer = document.getElementById('remoteVideosContainer');

const webrtc = new SimpleWebRTC({
    localVideo: localVideo,
    remoteVideos: remoteVideosContainer,
    autoRequestMedia: true,
    debug: false,
});

webrtc.on('readyToCall', () => {
    joinButton.addEventListener('click', () => {
        const username = usernameInput.value;

        if (username) {
            webrtc.joinRoom('your-room-name', (err, roomName) => {
                if (err) {
                    alert('Error joining the room: ' + err);
                } else {
                    videoContainer.style.display = 'block';
                }
            });
        } else {
            alert('Please enter your name before joining the meeting.');
        }
    });
});
