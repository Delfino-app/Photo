
var width = 320;    // We will scale the photo width to this
var height = 0;     // This will be computed based on the input stream

var streaming = false;

var video = null;
var canvas = null;
var photo = null;
var startbutton = null;

window.addEventListener("load",startup());


function startup() {
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    photo = document.getElementById('photo');
    startbutton = document.getElementById('startbutton');

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(function(stream) {
        video.srcObject = stream;
        video.play();
    })
    .catch(function(err) {
        console.log("An error occurred: " + err);
    });

    video.addEventListener('canplay', function(ev){
        if (!streaming) {
          height = video.videoHeight / (video.videoWidth/width);
  
          video.setAttribute('width', width);
          video.setAttribute('height', height);
          canvas.setAttribute('width', width);
          canvas.setAttribute('height', height);
          streaming = true;
        }
    }, false);

    startbutton.addEventListener('click', function(ev){
        takepicture();
        ev.preventDefault();
    }, false);

    clearphoto();
}

function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
}

function takepicture() {
    var context = canvas.getContext('2d');
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);

      var data = canvas.toDataURL('image/png');
      photo.setAttribute('src', data);

      renderPhoto(data);

    } else {
      clearphoto();
    }
}

async function renderPhoto(url){

    if (typeof window === 'undefined') return // make sure we are in the browser
    let response = await fetch(url);
    let data = await response.blob();
    let metadata = {
      type: 'image/jpg',
      lastModified: Date.now()
    };
    let file = new File([data], "img", metadata);
    //return file;

    console.log(file);
}

