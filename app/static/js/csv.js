// Create Array of Timelines for each user for the video in CSV file
function CSVtoTimelines(csvobj,video) {
  // Get the CSV object and create empty timelines array and dummy object for current user
  var vidObj = csvobj.getObject();
  var timelinesArray = [];
  var currentUser = {};
  currentUser['user']='';
  currentUser['segments'] = [];
  var first = true;
  
  // Loop through the elements in the video object
  for (var i in vidObj){
    // If this is the right video
    if (vidObj[i]['video']==video){
      // If this is our first user for this video
      if (first){
        // Set valence and arousal values
        valence = precise_round(vidObj[i]['ave_valence'],2);
        valence_stdev = precise_round(vidObj[i]['stdev_valence'],2);
        arousal = precise_round(vidObj[i]['ave_arousal'],2);
        arousal_stdev = precise_round(vidObj[i]['stdev_arousal'],2);
      }
      // If this is a new user
      if (currentUser['user'].length==0){
        // Update the current user object with a new segment and user_name
        currentUser['user'] = vidObj[i]['user_name'];
        currentUser['segments'].push(new Segment(vidObj[i]['start_time'],vidObj[i]['end_time'],
                                    vidObj[i]['laban_effort'],vidObj[i]['emotion'],
                                    vidObj[i]['body'],vidObj[i]['cluster']));
      } else if (vidObj[i]['user_name']==currentUser['user']){
        // Else if we are still on a segment by the previous user, add the segment
        currentUser['segments'].push(new Segment(vidObj[i]['start_time'],vidObj[i]['end_time'],
                                    vidObj[i]['laban_effort'],vidObj[i]['emotion'],
                                    vidObj[i]['body'],vidObj[i]['cluster']));
      } else {
        // Add the user with all of the segments to the timelines array, then reset the current user object
        timelinesArray.push(new User(currentUser['user'],currentUser['segments']));
        currentUser['user'] = vidObj[i]['user_name'];
        currentUser['segments'] = [];
        currentUser['segments'].push(new Segment(vidObj[i]['start_time'],vidObj[i]['end_time'],
                                    vidObj[i]['laban_effort'],vidObj[i]['emotion'],vidObj[i]['body'],
                                    vidObj[i]['cluster']));
      }
    }
  }
  return timelinesArray;
}

// Parse the clusters csv to get an array of cluster objects for displaying clusters stats
function CSVtoClusters(csvobj,video) {
  // Get the cluster object, declare the empty array, and make the dummy current cluster object
  var clusObj = csvobj.getObject();
  var clustersArray = [];
  var currentCluster = {};
  currentCluster['segment'] = {};
  currentCluster['size'] = 0;
  currentCluster['accuracy'] = 0;
  currentCluster['spread'] = 0;
  currentCluster['emostat'] = 0;
  // Loop through the elements in the cluster object
  for (var i in clusObj){
    // If the cluster is for our video
    if (clusObj[i]['video']==video){
      // Add the segment for that cluster and all of the stats to our current cluster
      currentCluster['segment'] = new Segment(clusObj[i]['start_time'],clusObj[i]['end_time'],
                                  clusObj[i]['mode'],clusObj[i]['emotion'],'',clusObj[i]['cluster']);
      currentCluster['size'] = clusObj[i]['size'];
      currentCluster['accuracy'] = clusObj[i]['accuracy'];
      currentCluster['spread'] = clusObj[i]['spread'];
      currentCluster['emostat'] = precise_round(clusObj[i]['emo_rate'],2);
      // If there are more than 3 data points in the current cluster, add it to the cluster array
      if (currentCluster['size']>3){
        clustersArray.push(new Cluster(currentCluster['segment'],currentCluster['size'],
                                  currentCluster['accuracy'],currentCluster['spread'],
                                  currentCluster['emostat']));
      }
      // Reset the current cluster to empty
      currentCluster['segment'] = {};
      currentCluster['size'] = 0;
      currentCluster['accuracy'] = 0;
      currentCluster['spread'] = 0;
      currentCluster['emostat']=0;
    }
  }
  return clustersArray;
}

// Define the current user object
function User(user,segments){
  this.user=user;
  this.segments=segments;
}

// Define the cluster object
function Cluster(segment,size,accuracy,spread,emostat){
  this.accuracy=accuracy;
  this.spread=spread;
  this.segment=segment;
  this.size=size;
  this.emostat=emostat;
}
