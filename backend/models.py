from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    user_folder_id = db.Column(db.String(1000), unique=True, nullable=False)
    email = db.Column(db.String(320), unique=True, nullable=False)
    password = db.Column(db.String(64), nullable=False)

    def __repr__(self):
        return f'<User {self.email}>'

class Channel(db.Model):
    __tablename__ = 'channels'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Reference to the User table
    platform = db.Column(db.String(50), nullable=False)  # Platform
    access_token = db.Column(db.Text, nullable=False)  # OAuth access token
    refresh_token = db.Column(db.Text, nullable=True)  # OAuth refresh token
    channel_name = db.Column(db.String(255), nullable=False)  # Name of the channel/profile
    channel_id = db.Column(db.String(255), nullable=False, unique=True)  # Unique identifier

    user = db.relationship('User', backref=db.backref('channels', lazy=True))

    def __repr__(self):
        return f'<Channel {self.platform} - {self.channel_name}>'