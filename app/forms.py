# -*- coding: utf-8 -*-
from app import app
from app import db
from .models import User, Segment, Video, Numbers
from flask.ext.wtf import Form
from wtforms import FieldList
from wtforms import Form as NoCsrfForm
from wtforms.fields import StringField, FormField, SubmitField, SelectField
from wtforms.validators import DataRequired, Length

"""
   Simple example to load and save a User instance with related phone
   entries in a WTForm
"""

choices = [(0,''),('Punch','Punch'),('Dab','Dab'),('Float','Float'),('Flick','Flick'),('Press','Press'),('Glide','Glide'),('Wring','Wring'),('Slash','Slash')]

# - - - Forms - - -
class UserForm(Form):
    user_name = StringField('First and Last Names', validators=[DataRequired()])
    age = StringField('Age')
    gender_id = StringField('Gender Identity')
    country = StringField('Birth Country')
    movementyears = StringField('Years Studied Movement')

class RenewForm(Form):
    user_name = StringField('First and Last Names', validators=[DataRequired()])

class SegmentForm(NoCsrfForm):
    # this forms is never exposed so we can use the non CSRF version
    start_time = StringField('Start Time', validators=[DataRequired(),Length(min=1, max=10)])
    end_time = StringField('End Time', validators=[DataRequired(),Length(min=1, max=10)])
    laban_effort = SelectField(u'Quality', choices = choices, validators = [DataRequired()], default=(0, ''))
    emotion = StringField('Emotion',validators=[DataRequired()])
    body = StringField('Body Parts Involved',validators=[DataRequired()])

class CombinedForm(Form):
    # video = StringField('Video', validators=[DataRequired()])
    # we must provide empth Phone() instances else populate_obj will fail
    segments = FieldList(FormField(SegmentForm, default=lambda: Segment()))
    complete = SubmitField('Submit and Complete Survey')
    submit = SubmitField('Submit and Do Another Video')
    overall = StringField('Overall Interpretation', validators=[DataRequired()])
    reason = StringField('Explanation')
    valence = SelectField(u'Positive/Negative', choices = [(-6,''),('-5','-5'),('-4','-4'),('-3','-3'),('-2','-2'),('-1','-1'),('0','Neutral'),('1','1'),('2','2'),('3','3'),('4','4'),('5','5')], validators = [DataRequired()], default=(-6, ''))
    arousal = SelectField(u'Arousal Level', choices = [(0,''),('1','1'),('2','2'),('3','3'),('4','4'),('5','5'),('6','6'),('7','7'),('8','8'),('9','9'),('10','10')], validators = [DataRequired()], default=(0, ''))





