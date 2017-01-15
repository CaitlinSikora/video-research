# -*- coding: utf-8 -*-

from app import app
from app import db

class Numbers(db.Model):
    index = db.Column(db.Integer(),primary_key=True)
    moNum = db.Column(db.Integer())
    num = db.Column(db.Integer())
    
class Video(db.Model):
    __tablename__ = 'videos'
    entry = db.Column(db.Integer(),primary_key=True)
    video = db.Column(db.String(50))
    user_name = db.Column(db.String(50))
    overall = db.Column(db.String(100))
    reason = db.Column(db.String(200))
    valence = db.Column(db.String(50))
    arousal = db.Column(db.String(50))
    segments = db.relationship('Segment')

class Segment(db.Model):
    __tablename__ = 'segments'
    segment_id = db.Column(db.Integer(), primary_key=True)
    video_entry = db.Column(db.Integer(), db.ForeignKey('videos.entry'))
    start_time = db.Column(db.String(4))
    end_time = db.Column(db.String(4))
    laban_effort = db.Column(db.String(50))
    emotion = db.Column(db.String(50))
    body = db.Column(db.String(50))

class User(db.Model):
    __tablename__ = 'users'
    user_id = db.Column(db.Integer(), primary_key=True)
    user_name = db.Column(db.String(50))
    age = db.Column(db.String(50))
    gender_id = db.Column(db.String(50))
    country = db.Column(db.String(50))
    movementyears = db.Column(db.String(50))
    numvideos = db.Column(db.Integer())
    whichvideos = db.Column(db.String(50))