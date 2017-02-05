// $( document ).ready(function()  {
//     loadVideo();
// });

// function loadVideo() {
//     var video = document.getElementById('video');
//     $(video).hide();
//     video.load();

//     video.addEventListener('canplaythrough', function() {
//       // Video is loaded and can be played
//       console.log('finished');
//       $(video).show();
//     }, false);
// }

function addSourceToVideo(element, src, type) {    
    var source = document.createElement('source');    
    source.src = src;    
    source.type = type;    
    element.appendChild(source);    
}

var video;       
$(document).ready(function(){    
    video = document.getElementsByTagName('video')[0];        
    console.log(video);
    addSourceToVideo( video, 'static/blurredVideos/instructions.mp4', "video/mp4");    
    video.addEventListener("progress", progressHandler,false);
    video.onloadeddata = function(){
        video.onseeked = function(){
        if(video.seekable.end(0) >= video.duration-0.1){
          alert("Video is all loaded!");
        } else {
          video.currentTime=video.buffered.end(0); // Seek ahead to force more buffering
        }
      };
      video.currentTime=0; // first seek to trigger the event
    };
});

progressHandler = function(e) {    
    if( video.duration ) {    
        var percent = (video.buffered.end(0)/video.duration) * 100;    
        console.log( percent );    
        if( percent >= 100 ) {    
            console.log("loaded!");    
        }    
        video.currentTime++;    
    }    
}