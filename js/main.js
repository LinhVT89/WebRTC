'use strict';

navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var constraints = {
  audio: false,
  video: true
};

function playStream(idVideoTag, stream) {
    const video = document.getElementById(idVideoTag);
    window.stream = stream; // stream available to console
    if (window.URL) {
      video.src = window.URL.createObjectURL(stream);
    } else {
      video.src = stream;
    }

    video.play();
}

var peer = new Peer({key: 'bckbh56bud1mj9k9'});

peer.on('open', function(id) {
  console.log('My peer ID is: ' + id);
  $('#myPeerId').append(id);
});

peer.on('call', function(call) {
  console.log('Receive Call Play Remote Stream');
  navigator.getUserMedia(constraints, function(stream) {
    /*call.answer(stream); // Answer the call with an A/V stream.
    call.on('stream', function(remoteStream) {
      // Show stream in some video/canvas element.
    });*/

    call.answer(stream);
    playStream('localStream', stream);
    call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
  }, errorCallPeer);
});

console.log('successCallback');
//Function getUserMedia success
function successCallback(stream) {
  playStream('localStream', stream);
}

//navigator.getUserMedia(constraints, successCallback, errorCallback);
/*function openStream() {
    return navigator.getUserMedia(constraints, successCallback, errorCallback);
}*/


console.log('errorCallback');
//Function getUserMedia error
function errorCallback(error) {
  console.log('navigator.getUserMedia error: ', error);
}


console.log('errorCallPeer');
//Function call peer faile
function errorCallPeer(err) {
  console.log('Failed to call remote stream' ,err);
}

console.log('successCallPeer');
//Function call peer success
function successCallPeer(stream) {
  console.log('Success to call remote stream');
  const id = $('#remotePeerId').val();

  console.log('Remote peer ID is: ' + id);
  playStream('localStream', stream);
  const call = peer.call(id, stream);
  //call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
  call.on('stream', function(remoteStream) {
      // Show stream in some video/canvas element.
      playStream('remoteStream', remoteStream);
  });
}


//Check Button Call Click
$(document).on('click','#btnCall',function(){
  console.log('Begin call remote stream');
  navigator.getUserMedia(constraints, successCallPeer, errorCallPeer);
});
