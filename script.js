// Create variables for the local and remote video elements, the local and remote video streams, and the RTCPeerConnection object.
const localVideo = document.querySelector('#local-video');
const remoteVideo = document.querySelector('#remote-video');
const localStream = null;
const remoteStream = null;
const peerConnection = new RTCPeerConnection();

// Define event listeners for the call and hangup buttons.
document.querySelector('#call-btn').addEventListener('click', () => {
  // Get the local video and audio streams.
  navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
    localStream = stream;
    localVideo.srcObject = stream;

    // Create a new RTCPeerConnection object and add the local stream to it.
    peerConnection.addStream(stream);

    // Create an offer and send it to the remote peer.
    peerConnection.createOffer().then((offer) => {
      peerConnection.setLocalDescription(offer);
      // Send the offer to the remote peer.
    });
  });
});

document.querySelector('#hangup-btn').addEventListener('click', () => {
  // Close the RTCPeerConnection object.
  peerConnection.close();

  // Stop the local video and audio streams.
  localStream.stop();
});

// Define an event listener for the ICEConnectionStateChange event.
peerConnection.addEventListener('iceconnectionstatechange', () => {
  // If the connection state is "connected", start the remote video stream.
  if (peerConnection.iceConnectionState === 'connected') {
    remoteVideo.srcObject = remoteStream;
  }
});

// Define an event listener for the remote stream.
peerConnection.addEventListener('addstream', (event) => {
  remoteStream = event.stream;
});
