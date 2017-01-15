
// jquery shit

$(function() {
    var jptr = 0;
    $("div[data-toggle=fieldset]").each(function() {
        var $this = $(this);
            
        //Add new entry
        $this.find("button[data-toggle=fieldset-add-row]").click(function() {
            //var fieldthis = $(this);
            var target = $($(this).data("target"));
            //console.log(target);
            var oldrow = target.find("[data-toggle=fieldset-entry]:last");
            var row = oldrow.clone(true, true);
            //console.log(row.find(":input")[0]);
            var elem_id = row.find(":input")[0].id;
            var elem_num = parseInt(elem_id.replace(/.*-(\d{1,4})-.*/m, '$1')) + 1;
            row.attr('data-id', elem_num);
            row.find(":input").each(function() {
                //console.log(this);
                var id = $(this).attr('id').replace('-' + (elem_num - 1) + '-', '-' + (elem_num) + '-');
                $(this).attr('name', id).attr('id', id).val('').removeAttr("checked");
            });
            oldrow.after(row);
        }); 

        //$('document').on('keyup', function( e ) {
            //console.log("up");
            console.log(jptr);
            jptr++;
        // $(window).keypress(function(e) {
        //     //console.log(e.keyCode);
        //     if (e.keyCode == 46) {
        //         //console.log('Space pressed');
        //         time = precise_round(vid.time(),2);
        //         if (time-1 > 0){
        //             prev_time = precise_round(time-1,2);
        //         } else {
        //             prev_time = 0;
        //         }
        //         segments.push(new Segment(time));
        //         segmentIndex+=1;
        //         segments.sort(function(a, b){
        //             return a.end_time > b.end_time;
        //         });
        //         //console.log("next index",segmentIndex);
        //         //markings.sort();
        //         //console.log("Added");
        //         var target = $($this.find("button[data-toggle=fieldset-add-row]").data("target"));
        //         //console.log("target",target);
        //         var oldrow = target.find("[data-toggle=fieldset-entry]:last");
        //         //console.log("id",oldrow.find(":input")[0].id);
        //         var row = oldrow.clone(true, true);
        //         //console.log(row.find(":input")[0]);
        //         var elem_id = row.find(":input")[0].id;
        //         var elem_num = parseInt(elem_id.replace(/.*-(\d{1,4})-.*/m, '$1')) + 1;
        //         row.attr('data-id', elem_num);
        //         row.find(":input").each(function() {
        //             //console.log(this.id);
        //             var id = $(this).attr('id').replace('-' + (elem_num - 1) + '-', '-' + (elem_num) + '-');
        //             //console.log(id);
        //             // YOU MIGHT NEED THIS LINE!
        //             //$(this).attr('name', id).attr('id', id).val('').removeAttr("checked");
        //             if ($(this).attr('name').includes('start_time')){
        //                 $(this).attr('name', id).attr('id', id).val(prev_time).removeAttr("checked");
        //                 //console.log($(this).attr('name'));
        //             } else if ($(this).attr('name').includes('end_time')){
        //                 $(this).attr('name', id).attr('id', id).val(time).removeAttr("checked");
        //                 //console.log($(this).attr('name'));
        //             } else {
        //                 $(this).attr('name', id).attr('id', id).val('').removeAttr("checked");
        //                 //console.log($(this).attr('name'));
        //             }
        //         });
        //         oldrow.after(row);
        //         if (first){
        //             oldrow.remove();
        //             first = false;
        //         }
        //     }
        // });
        //End add new entry

        //Remove row
        $this.find("button[data-toggle=fieldset-remove-row]").click(function() {
            if($this.find("[data-toggle=fieldset-entry]").length > 1) {
                var thisRow = $(this).closest("[data-toggle=fieldset-entry]");
                //console.log("removing");
                var removeTime = thisRow.find(':input').find('end_time').prevObject[1].value;
                //var index = segments.indexOf(Number(removeTime));
                var index = segments.map(function(e) { return e.index; }).indexOf(int(thisRow.attr('data-id')));
                //console.log("index remove",index);
                //var index=int(thisRow.attr('data-id'));
                //console.log(index);
                if(index!=-1){
                    segments.splice(index, 1);
                }
                thisRow.remove();
            }
        }); //End remove row
    });
});

var time=0;
var prev_time=0;
var first = true;


function precise_round(value, decPlaces){
    var val = value * Math.pow(10, decPlaces);
    var fraction = (Math.round((val-parseInt(val))*10)/10);

    //this line is for consistency with .NET Decimal.Round behavior
    // -342.055 => -342.06
    if(fraction == -0.5) fraction = -0.6;

    val = Math.round(parseInt(val) + fraction) / Math.pow(10, decPlaces);
    return val;
}


// p5.js shit

var vid;
var markings = [];
var segments = [];
var drag = false;
var progress = false;
var dragWhich;
var changefield;
var segmentIndex=1;
var video;

function preload() {
  console.log("Loading video into element");
  vid = createVideo(video);
}

console.log("Downloading video...hellip;Please wait...")
var xhr = new XMLHttpRequest();
xhr.open('GET', vidname, true);
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
  vid.show();
  vid.showControls();
  vid.volume(0);
  vid.size(600,400);
  vid.position(40, 220);
  //console.log(vid.position().y);
  //console.log(vid.size());
  createCanvas(600,20);      
  // start with a dummy segment to cap the beginning times
  segments.push(new Segment(inverseTransform(102),inverseTransform(102),0));           
}

function draw() {
  // draw the background
  background(255);
  // draw the timeline
  drawTimeline(108,549);
  // draw the segments after the dummy segment
  for (var i=1; i<segments.length;i++){
    segments[i].drawSegment();
  }
  // drag the marker that is selected
  if (drag){
    // if marker is beginning marker
    if (dragWhich==0){
      // move the marker
      //var index = segments.map(function(e) { return e.index; }).indexOf(drag-1);
      //console.log("index",index,"drag",drag);
      var newTime = Math.round(segments[drag].dragStart(segments[drag-1].end.xPos+6)*100)/100;
      // update times in data fields
      changefield.val(newTime);
    } else {  // if it's an end marker
      //console.log("index",index, "drag",drag);
    // if it's not the last end marker
      if (drag<segments.length-1){
        // move the marker
        //var index = segments.map(function(e) { return e.index; }).indexOf(drag+1);
        var newTime = Math.round(segments[drag].dragEnd(segments[drag+1].start.xPos-6)*100)/100;
      } else {
        // move the marker
        var newTime = Math.round(segments[drag].dragEnd(timeTransform(duration))*100)/100;
      }
      // update the data field
      changefield.val(newTime);
    }
  }
  if (progress){
    console.log("progress",progress);
    var newTime = segments[progress].progress();
    changefield.val(newTime);
  }
  //console.log({{num}},vid.duration(),'{{this_video}}');
}

function drawTimeline(x0,x1){
  stroke(157,157,157);
  strokeWeight(2);
  line(x0,9,x1,9);
  strokeWeight(6);
  line(timeTransform(0),7,timeTransform(0),13);
  line(timeTransform(duration),7,timeTransform(duration),13);
}

function timeTransform(time){
  var fraction = time/duration;
  var posTime = 108 + fraction*(549-108);
  return posTime;
}
function inverseTransform(xPos){
  var fraction = duration/(549-108);
  var time = fraction*(xPos-108);
  return time;
}

function Marking(time){
  this.time=time;
  this.xPos=timeTransform(time);

  this.dragMarking=function(bound0,bound1){
    if (mouseX>=bound0&&mouseX<=bound1){
      this.xPos=mouseX;
    } else if (mouseX<bound0){
      this.xPos=bound0;
    } else {
      this.xPos=bound1;
    }
    this.time=inverseTransform(this.xPos);
    return this.time;
  };

  this.progMarking=function(new_time){
    this.xPos=timeTransform(new_time);
    return new_time;
  };

  this.drawMarking=function(){
    strokeWeight(6);
    line(this.xPos,7,this.xPos,13);
  };

}

function Segment(t1, t2, segmentIndex){
  this.start = new Marking(t1);
  this.end = new Marking(t2);
  this.index = segmentIndex;
  this.end_time = this.end.time;
  //console.log("added index",segmentIndex);

  this.drawSegment=function(){
    stroke(0,255,0);
    this.start.drawMarking();
    stroke(255,0,0);
    this.end.drawMarking();
    stroke('#1474cd');
    strokeWeight(4);
    line(this.start.xPos,9,this.end.xPos,9);
  };

  this.dragStart=function(bound0){
    return this.start.dragMarking(bound0,this.end.xPos-6);
  };

  this.dragEnd=function(bound1){
    end_time = this.end.dragMarking(this.start.xPos+6,bound1);
    this.end_time = end_time;
    return end_time;
  };

  this.progress=function(){
    this.end_time = this.end.progMarking(precise_round(vid.time(),2));
    //console.log("progress",this.end_time);
    return this.end_time;
  };
}

function mousePressed(){
  // Check if the mouse is on a marker
  for (var i=1; i<segments.length;i++){
    // if it's on a beginning marker
    if (mouseX<=(segments[i].start.xPos+4)&&mouseX>=(segments[i].start.xPos-4)&&mouseY<=14&&mouseY>=6){
      // save that it's a beginning marker and which marker it is
      drag = i;
      dragWhich = 0;
      //console.log("drag",drag);
      // store the field to update in a variable
      changefield=$("div[data-toggle=fieldset]").find("[data-toggle=fieldset-entry]").filter("[data-id="+segments[drag].index+"]").find(":input[name='segments-"+segments[drag].index+"-start_time']");
    }
    // if it's an end marker
    if (mouseX<=(segments[i].end.xPos+4)&&mouseX>=(segments[i].end.xPos-4)&&mouseY<=14&&mouseY>=6){
      // save that it's an end marker
      drag = i;
      // save which marker
      dragWhich = 1;
      //console.log("drag",drag);
      // store the field to update in a variable
      changefield=$("div[data-toggle=fieldset]").find("[data-toggle=fieldset-entry]").filter("[data-id="+segments[drag].index+"]").find(":input[name='segments-"+segments[drag].index+"-end_time']");
    }
  }
}

function mouseReleased(){
  // stop dragging
  drag = false;
}

function keyReleased() {
    // set the beginning time for the new segment
    progress = false;
}

function insert(st_time) {
  var loc = 0; 
  for (var j=0; j < segments.length; j++){
    if (segments[j].start.time>=st_time){
        loc = j-1;
        break;
    } else {
        loc = j;
    }
  }
  console.log("loc",loc);
  segments.splice(loc + 1, 0, new Segment(st_time, st_time, segmentIndex));
  for (var i=0; i < segments.length; i++){
  console.log("start",segments[i].start.time,"index",segments[i].index);
  }
  return ;
}

// create the new field and segment
function keyPressed() {
    //$("div[data-toggle=fieldset]").each(function() {
        var $this = $(this);
            //console.log(keyCode);
            //console.log(e.keyCode);
            if (keyCode == 220) {
                console.log('PERIOD ON!');
                time = precise_round(vid.time(),2);
                prev_time = time;

                // if (time-1 > 0){
                //     prev_time = precise_round(time-1,2);
                // } else {
                //     prev_time = 0;
                // }
                console.log("segmentIndex",segmentIndex);
                //segments.push(new Segment(prev_time, time, segmentIndex));
                insert(time);
                progress = segments.map(function(e) { return e.index; }).indexOf(segmentIndex);
                console.log("numsegs",segments.length);
                //console.log("progress",progress);
                segmentIndex+=1;
                // segments.sort(function(a, b){
                //     return a.start_time > b.start_time;
                // });
                //console.log("next index",segmentIndex);
                //markings.sort();
                //console.log("Added");
                var target = $($this.find("button[data-toggle=fieldset-add-row]").data("target"));
                //console.log("target",target);
                var oldrow = target.find("[data-toggle=fieldset-entry]:last");
                //console.log("id",oldrow.find(":input")[0].id);
                var row = oldrow.clone(true, true);
                //console.log(row.find(":input")[0]);
                var elem_id = row.find(":input")[0].id;
                var elem_num = parseInt(elem_id.replace(/.*-(\d{1,4})-.*/m, '$1')) + 1;
                row.attr('data-id', elem_num);
                row.find(":input").each(function() {
                    //console.log(this.id);
                    var id = $(this).attr('id').replace('-' + (elem_num - 1) + '-', '-' + (elem_num) + '-');
                    //console.log(id);
                    // YOU MIGHT NEED THIS LINE!
                    //$(this).attr('name', id).attr('id', id).val('').removeAttr("checked");
                    if ($(this).attr('name').includes('start_time')){
                        $(this).attr('name', id).attr('id', id).val(prev_time).removeAttr("checked");
                        //console.log($(this).attr('name'));
                    } else if ($(this).attr('name').includes('end_time')){
                        $(this).attr('name', id).attr('id', id).val(time).removeAttr("checked");
                        //console.log($(this).attr('name'));
                    } else {
                        $(this).attr('name', id).attr('id', id).val('').removeAttr("checked");
                        //console.log($(this).attr('name'));
                    }
                });
                oldrow.after(row);
                if (first){
                    oldrow.remove();
                    first = false;
                }
                changefield=$("div[data-toggle=fieldset]").find("[data-toggle=fieldset-entry]").filter("[data-id="+segments[progress].index+"]").find(":input[name='segments-"+segments[progress].index+"-end_time']");
            }


        //End add new entry


    //});
}

// function mousePressed(){
//   for (var i=2; i<markings.length;i++){
//     //console.log(markings[i]);
//     if (mouseX<=(markings[i].xPos+3)&&mouseX>=(markings[i].xPos-3)&&mouseY<=13&&mouseY>=7){
//       drag = i;
//       $("div[data-toggle=fieldset]").find("[data-toggle=fieldset-entry]").each(function() {
//          if ($(this).attr('data-id')==drag-2){
//           $(this).find(":input").each(function() {
//               if ($(this).attr('name').includes('end_time')){
//                   changefield=$(this);
//               }
//           });
//         }
//       });
//     }
//   }
// }

// function mouseReleased(){
//   drag = false;
// }

