#!flask/bin/python

def prep_db():
    db.drop_all()
    db.create_all()
    numbers = Numbers(num=0,moNum=0,index=1)
    db.session.add(numbers)
    db.session.commit()
    print Numbers.query.get(1)

from app import app
from app import db
from app.models import Numbers

if __name__ == '__main__':
	prep_db()
	app.run(debug=True)