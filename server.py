from flask import Flask
app = Flask(__name__)

videos = []

################ PAGES ####################

@app.route('/',methods=['GET'])
def render_home():
	# Should return render template of home
    return 'Hello, World! Welcome to your home.'

@app.route('/participate',methods=['GET'])
def render_survey():
	# Will call the videos endpoint and render the survey page

@app.route('/thanks',methods=['GET'])
def render_thanks():
	# Will render the thank you page

@app.route('/about',methods=['GET'])
def render_about():
	# Will render the about page

@app.route('/results',methods=['GET'])
def render_results():
	# Will call the videos endpoint and render the results page

################ ACTIONS ####################

@app.route('/videos',methods=['GET'])
def get_videos():
	# Will return the videos to the user

@app.route('/receive',methods=['POST'])
def receive_data():
	# Take apart a piece of JSON and call method to write to the database

@app.route('download',method=['GET'])
def download_results():
	# Will construct a CSV file for researcher to download
