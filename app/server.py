from flask import render_template, flash, redirect, session, url_for, request
from app import app
from app import db
from .forms import UserForm, SegmentForm, CombinedForm, RenewForm
from .models import User, Segment, Video, Numbers
import random

videos = []

################ PAGES ####################

@app.route('/',methods=['GET','POST'])
def render_home():
	form = UserForm()
	if form.validate_on_submit():
		enter_user(form)
		return redirect(url_for('render_instructions'))
	return render_template('index.html', form=form)

@app.route('/instructions',methods=['GET'])
def render_instructions():
	# Will call the videos endpoint and render the survey page
	return render_template('instructions.html')

@app.route('/participate',methods=['GET'])
def render_survey():
	# Will call the videos endpoint and render the survey page
	form = CombinedForm()
	return render_template('segments.html', form=form)

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
def enter_user(form):
	user = User(user_name="name",numvideos=1,whichvideos="")
	form.populate_obj(user)
	print user
	return

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
