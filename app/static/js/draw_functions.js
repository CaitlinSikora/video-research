// Make a function to draw a timeline for an individual user at a given y location
function drawTimeline(user,y){
  // Draw the main line.
  stroke(157,157,157);
  strokeWeight(2);
  line(x0,y,x1,y);
  // Draw the endpoints.
  strokeWeight(6);
  line(timeTransform(0),y-2,timeTransform(0),y+4);
  line(timeTransform(duration),y-2,timeTransform(duration),y+4);
  // Loop through the segments of the user
  for (var i=0; i<user['segments'].length;i++){
    // Draw the segment.
    user['segments'][i].drawSegment(y);
    // If the current time of the video is in the segment timeframe
    if (vid.time()>=user['segments'][i]['start']['time']&&vid.time()<user['segments'][i]['end']['time']){
      // Display the user choices for that segment
      strokeWeight(0.5);
      stroke(0);
      fill(0);
      text(user['segments'][i]['effort'],560,y+4);
      text(user['segments'][i]['emotion'].split(' ')[0],600,y+4);
      text(user['segments'][i]['body'],680,y+4);
      // Push the current Effort label to the currentEfforts array.
      currentEfforts.push(user['segments'][i]['effort']);
    }
  }
  strokeWeight(0.5);
  stroke(0);
  fill(0);
}

// Draw the main timeline with all of the segment clusters visualized
function drawOneLine(x,y){
  // Move to the location
  push();
  translate(x,0);
  noStroke();
  fill(220,220,220);
  // Draw the background gray to give the main timeline greater visual value on the page.
  rect(x0,y+1,x1-x0,30);
  // Loop through the cluster array and draw the segments for each cluster at different height
  for (var i = 0; i<clustersArray.length;i++){
    clustersArray[i]['segment'].drawMiddle(y+25-(20*i/clustersArray.length),6);
  }
  // Draw the top and bottom timelines
  stroke(170,170,170);
  strokeWeight(4);
  line(x0,y+1,x1,y+1);
  line(x0,y+31,x1,y+31);
  strokeWeight(6);
  // Draw the bookends
  line(timeTransform(0),y,timeTransform(0),y+30);
  line(timeTransform(duration),y,timeTransform(duration),y+30);
  line(timeTransform(0),y+30,timeTransform(0),y+34);
  line(timeTransform(duration),y+30,timeTransform(duration),y+34);
  // Loop through the timeslines array
  for (var i = 0; i<timelinesArray.length;i++){
    for (var j=0; j<timelinesArray[i]['segments'].length;j++){
      timelinesArray[i]['segments'][j].drawMarkings(y);
    }
  }
  // Move back to origin
  pop();
  // Loop through the clusters and display the stats for the current time in the video
  for (var i=0; i<clustersArray.length;i++){
    // If the video play point is in the cluster
    if (vid.time()>=clustersArray[i].segment.start.time&&vid.time()<clustersArray[i].segment.end.time){
      // If the cluster text isn't already set
      if (!cluster_text) {
        // Set accuracy to percentage and spread to rounded number.
        var accuracy = int(clustersArray[i].accuracy*100);
        var spread = precise_round(clustersArray[i].spread,2);
        
        // Print the effort in large text near the composite timeline
        strokeWeight(0.5);
        stroke(0);
        fill(0);
        textSize(16);
        text('Cluster:',860,485);
        textSize(28);
        text(clustersArray[i].segment.effort,560,y+26);
        // Print the effort in the central location
        textSize(24);
        text(clustersArray[i].segment.effort,860,515);
        // Print the accuracy and spread stats in the central location
        textSize(12);
        text(str(accuracy)+'% of '+str(clustersArray[i].size)+' Segments',930,515);
        textSize(12);
        text('(Spread '+str(spread)+')',860,535);
        textSize(20);
        // Print the emotional interpretation and statistics in the central location
        text(clustersArray[i].segment.emotion,860,563);
        textSize(12);
        text(str(int(clustersArray[i].emostat*100))+'% agreement',860,583);
        // Set cluster_text to true to avoid writing text for more than one cluster over the other.
        cluster_text=true;
      }
    }
  }
  // Set cluster_text to false so it will be updated in the next frame
  cluster_text=false;
}

// Draw the points in the cluster plot on the upper right.
function drawPoints(x,y){
  // Move to the right place on the screen and scale appropriately.
  push();
  translate(270,50);
  scale(0.50);
  // Set text parameters
  stroke(157,157,157);
  strokeWeight(1);
  textSize(18);
  // Print the duration to indicate the scale of both x and y axes.
  text(str(duration),x-16,y-x1-14);
  text(str(duration),x1+x+14,y+8);
  // Print 0 to indicate the origin
  text('0',x-14,y+14);
  strokeWeight(2);
  // Display the axes
  line(x,y,x1+x,y);
  line(x,y,x,y-x1);
  // Loop through the timelines array
  for (var i = 0; i<timelinesArray.length;i++){
    // Loop through the segments in this timeline
    for (var j=0; j<timelinesArray[i]['segments'].length;j++){
      // Draw each segment's (start_time,end_time) point on the plot, translated by <x.y>
      timelinesArray[i]['segments'][j].drawPoint(x,y);
    }
  }
  // Loop through the cluster array
  for (var i = 0; i<clustersArray.length;i++){
    // Set text parameters
    strokeWeight(0.5);
    stroke(0);
    fill(0);
    textSize(24);
    // Display the effort at the center of each cluster.
    text(clustersArray[i].segment.effort,clustersArray[i].segment.start.xPos+x,y-clustersArray[i].segment.end.xPos);
  }
  pop();
}

// Draw the metadata for the video
function drawMetaData(){
  // Set text size and color
  fill(0);
  // Display the number of observers
  textSize(12);
  text('('+str(timelinesArray.length)+' Observers)',940,360);
  // Display the crowdsourced valence, arousal and standard deviations.
  textSize(13);
  text('Average Valence:  '+valence,680,416);
  text('Average Arousal:   '+arousal,680,430);
  textSize(10);
  text('(standev. '+valence_stdev+')',850,416);
  text('(standev. '+arousal_stdev+')',850,430);
  // Display the self-reported valence and arousal
  if (vidInd>3){
    text('Self-reported: '+reported[vidInd-4][0],954,416);
    text('Self-reported: '+reported[vidInd-4][1],954,430);
  }
  textSize(12);
}

// Draw the line and write the current video time to track the time
function drawVidLine(){
  stroke(157,157,157);
  strokeWeight(1);
  line(timeTransform(vid.time()),446,timeTransform(vid.time()),494+15*(timelinesArray.length));
  textSize(18);
  text(precise_round(vid.time(),2),timeTransform(vid.time())-20,524+15*(timelinesArray.length));
}

// Draw instantaneous stats
function drawInstantStats(){
  // Set the current max effort and calculate its accuracy
  currentMax = getMaxOccurrence(currentEfforts);
  maxAccuracy = precise_round(currentMax[1]/currentEfforts.length,2);
  // Display the instantaneous statistics
  textSize(16);
  text('Instantaneous:',860,630);
  textSize(24);
  text(currentMax[0],860,660);
  textSize(12);
  text(int(maxAccuracy*100)+'% of '+currentEfforts.length+' Segments',930,660);
  // Clear the current Efforts array for the next frame
  currentEfforts = [];
}