from flask import render_template, flash, redirect, session, url_for, request
from app import app
from app import db
from .forms import UserForm, SegmentForm, CombinedForm, RenewForm
from .models import User, Segment, Video, Numbers
import random

videos = ['static/blurredVideos/video2.mp4',
'static/blurredVideos/video4.mp4',
'static/blurredVideos/video5.mp4',
'static/blurredVideos/video6.mp4',
'static/mocapVideos/AlisonAngryClip.mp4',
'static/mocapVideos/EdwinContentClip.mp4',
'static/mocapVideos/AlisonJoyfulClip.mp4',
'static/mocapVideos/EdwinSadClip.mp4']

durations = [29.504,25.301333,20.309333,22.378667, 31.296,29.290667,35.093333,31.445333]

################ PAGES ####################

@app.route('/',methods=['GET','POST'])
def render_home():
	form = UserForm()
	if form.validate_on_submit():
		user = enter_data(form,User,numvideos=1,whichvideos="")
		session['user_name'] = user.user_name
		return redirect(url_for('render_instructions'))
	return render_template('index.html', form=form)

@app.route('/instructions',methods=['GET'])
def render_instructions():
	# Will call the videos endpoint and render the survey page
	return render_template('instructions.html')

@app.route('/participate',methods=['GET','POST'])
def render_survey():
	# Will call the videos endpoint and render the survey page
	video = Video(user_name=session['user_name'],video=0,segments=[Segment(start_time="0",end_time="10")])    
	form = CombinedForm(obj=video)
	if form.validate_on_submit():
		enter_data(form,Video,user_name=session['user_name'],video=0,segments=[Segment(start_time="0",end_time="10")])
		return redirect(url_for('render_instructions'))
	return render_template('segments.html', form=form, choice=1,this_video=videos[0], duration=durations[0])

@app.route('/thanks',methods=['GET'])
def render_thanks():
	# Will render the thank you page
	return render_template('thanks.html', user=session['user_name'])

@app.route('/about',methods=['GET'])
def render_about():
	# Will render the about page
	return render_template('results.html')

@app.route('/results',methods=['GET'])
def render_results():
	# Will call the videos endpoint and render the results page
	return render_template('segmentvis.html',video=video)


################ ACTIONS ####################

# @app.route('/enter_user',methods=['POST'])
def enter_data(form, model, **kwargs):
	# TODO: need to test the model to make sure it's valid
	the_object = model(**kwargs)
	print the_object
	for kwarg in kwargs:
		print kwargs[kwarg]
	form.populate_obj(the_object)
	db.session.add(the_object)
	db.session.commit()
	# We need to return the object to allow it to be accessed out this method
	# This could also serve as a "success" test?
	return the_object

@app.route('/videos',methods=['GET'])
def get_videos():
	# Will return the videos to the user
	return None

@app.route('/receive',methods=['POST'])
def receive_data():
	# Take apart a piece of JSON and call method to write to the database
	return None

@app.route('/download',methods=['GET'])
def download_results():
	# Will construct a CSV file for researcher to download
	return None
