var vid;
// Create variables to display crowd-sourced valence and arousal
var valence, arousal, valence_stdev, arousal_stdev;
// Set x positions of beginning and end of video
var x0 = 140;
var x1 = 532;
// Create a variable for the duration of the video
var duration;

// Create the array of video names
var videos = ['static/blurredVideos/video2.mp4',
  'static/blurredVideos/video4.mp4',
  'static/blurredVideos/video5.mp4',
  'static/blurredVideos/video6.mp4',
  'static/mocapVideos/AlisonAngryClip.mp4',
  'static/mocapVideos/EdwinContentClip.mp4',
  'static/mocapVideos/AlisonJoyfulClip.mp4',
  'static/mocapVideos/EdwinSadClip.mp4']
// Create the array of self-reported valence and arousal
var reported = [[-5,10],[0,6],[5,10],[-1.5,0]];
// Create the array of video durations
var durations = [29.504,25.301333,20.309333,22.378667,31.296,29.290667,35.093333,31.445333];

// Create an array to store the instantaneous set of reported efforts and 
var currentEfforts = [];
// Create an array to store the current max effort and its frequency
var currentMax = [];
// Create a variable to store the accuracy maxAccuracy of the current max effort
var maxAccuracy = 0;

var colors = [[0,0,255],[0,255,0],[255,0,0],[255,255,0],[0,255,255],[150,51,180],[255,153,51],[255,103,204]]
var cluster_text = false;

function preload() {
  // Set the duration for the current video.
  duration = durations[vidInd];
  // Load the video.
  console.log("Loading video");
  vid = createVideo(videos[vidInd]);
  console.log("Video Loaded");
  // Load all the personal data
  theData = loadTable(
  'static/CleanData.csv',
  'csv',
  'header');
  // Load the clusters data
  clusterData = loadTable(
  'static/clusters.csv',
  'csv',
  'header');
}

console.log("Downloading video...hellip;Please wait...")
var xhr = new XMLHttpRequest();
xhr.open('GET', videos[vidInd], true);
xhr.responseType = 'blob';
xhr.onload = function(e) {
  if (this.status == 200) {
    console.log("got it");
    var myBlob = this.response;
    video = (window.webkitURL ? webkitURL : URL).createObjectURL(myBlob);
    // myBlob is now the blob that the object URL pointed to.
    //vid = document.getElementById("video");
    vid.src = video;
    // not needed if autoplay is set for the video element
    // video.play()
   }
  }

xhr.send();

function setup() {
  // Process the clusters and individual timelines into the arrays.
  timelinesArray = CSVtoTimelines(theData,str(vidInd+1));
  clustersArray = CSVtoClusters(clusterData,str(vidInd+1));
  console.log("# of Clusters"+clustersArray.length);
  console.log("# of Users "+timelinesArray.length);
  // Show the video and controls
  vid.show();
  vid.showControls();
  vid.volume(0);
  // Set the size and position of the video.
  vid.size(550,416);
  vid.position(34,50);
  // Create the canvas
  createCanvas(1300,1000);       
}

function draw() {
  // Draw a white background
  background(255);
  
  // Draw the metadata for the video.
  drawMetaData();
  
  if (frameCount>10){
    
    // Draw the array of timeslines
    for (var i = 0; i<timelinesArray.length;i++){
      drawTimeline(timelinesArray[i],496+15*(i+1));
    }
    
    // Draw the composite timeline
    drawOneLine(0,446);
    
    // Draw a line and text to keep track of the current time in the video.
    drawVidLine();
    
    // Draw the cluster points in the upper right plot
    drawPoints(840,670);
    
    if (currentEfforts.length>0){
      drawInstantStats();
    }
  }
}

