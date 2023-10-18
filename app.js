const agoraAppId = '25540f7394b841d29dfe60b86c43a5eb';
const localStreamContainer = document.getElementById('localStream');
const remoteStreamContainer = document.getElementById('remoteStreams');
let client, localStream;

// Initialize Agora Client
async function initializeAgoraClient() {
    client = AgoraRTC.createClient({ mode: 'rtc', codec: 'h264' });
    await client.init(agoraAppId);
}

// Join a video chat session
async function joinVideoChat() {
    localStream = AgoraRTC.createStream({
        video: true,
        audio: true,
    });
    await localStream.init();

    // Play the local video stream
    localStream.play('localStream');

    // Publish the local stream
    await client.publish(localStream);

    // Subscribe to remote streams
    client.on('stream-added', function (evt) {
        client.subscribe(evt.stream, (err) => {
            console.log('Subscribe stream failed', err);
        });
    });

    // Play the remote video stream
    client.on('stream-subscribed', function (evt) {
        const remoteStream = evt.stream;
        const remoteStreamContainer = document.createElement('div');
        remoteStreamContainer.id = `remote-${remoteStream.getId()}`;
        remoteStreamContainer.classList.add('video-container');
        document.body.appendChild(remoteStreamContainer);
        remoteStream.play(`remote-${remoteStream.getId()}`);
    });
}

// Leave the video chat session
function leaveVideoChat() {
    if (localStream) {
        localStream.close();
        client.unpublish(localStream);
        const remoteStreams = document.querySelectorAll('.video-container');
        remoteStreams.forEach((stream) => {
            stream.innerHTML = '';
        });
    }
}

// Event listeners
window.addEventListener('beforeunload', leaveVideoChat);

// Start the video chat
initializeAgoraClient()
    .then(() => joinVideoChat())
    .catch(console.error);
