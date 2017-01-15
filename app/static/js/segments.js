// Make a function to transform a time into x position.
function timeTransform(time){
  var fraction = time/duration;
  var posTime = x0 + fraction*(x1-x0);
  return posTime;
}

// Make a function to transform x position into time.
function inverseTransform(xPos){
  var fraction = duration/(x1-x0);
  var time = fraction*(xPos-x0);
  return time;
}

// Make a class of markings
function Marking(time){
  this.time=time;
  this.xPos=timeTransform(time);
  // Make a method to draw the marking at a specified y location
  this.drawMarking=function(y){
    strokeWeight(6);
    line(this.xPos,y-2,this.xPos,y+4);
  };
  // Make a function to draw a small mark to visualize many start/stop markings on one line
  this.drawSmallMark=function(y){
    strokeWeight(3);
    line(this.xPos,y-1,this.xPos,y+2);
  };
}

// Make a class of segments that stores stats and times
function Segment(t1, t2, effort, emotion, body, cluster){
  this.start = new Marking(t1);
  this.end = new Marking(t2);
  this.effort = effort;
  this.emotion = emotion;
  this.body = body;
  this.cluster = cluster;
  
  // Use a method to draw the segment
  this.drawSegment=function(y){
    // Draw the start marking green.
    stroke(0,255,0);
    this.start.drawMarking(y);
    // Draw the end marking red.
    stroke(255,0,0);
    this.end.drawMarking(y);
    // Fill in the in-between space with the color for that cluster.
    stroke(colors[this.cluster-1][0],colors[this.cluster-1][1],colors[this.cluster-1][2])
    strokeWeight(4);
    line(this.start.xPos,y,this.end.xPos,y);
  };
  
  // Draw just the small start and end times to visualize all the start and end times on 2 different lines.
  this.drawMarkings=function(y){
    stroke(0,255,0);
    this.start.drawSmallMark(y);
    stroke(255,0,0);
    this.end.drawSmallMark(y+30);
  }
  
  // Draw the point for the segment in the cluster plot at the position (x,y).
  this.drawPoint=function(x,y){
    fill(colors[this.cluster-1][0],colors[this.cluster-1][1],colors[this.cluster-1][2]);
    noStroke();
    ellipseMode(CENTER);
    ellipse(this.start.xPos+x,y-this.end.xPos,6,6);
  }
  
  // Draw just the middle of the segment without endpoints with variable y and width for main timeline.
  this.drawMiddle=function(y,wid){
    stroke(colors[this.cluster-1][0],colors[this.cluster-1][1],colors[this.cluster-1][2]);
    strokeWeight(wid);
    line(this.start.xPos,y,this.end.xPos,y);
  }
}

