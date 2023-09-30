from flask import Flask, render_template, request, redirect, url_for, session
from flask_oauthlib.client import OAuth
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.secret_key = 'HelloWorld1963'  # Change this to a strong, random value
socketio = SocketIO(app)

# OAuth Configuration (Replace with your own Google OAuth credentials)
oauth = OAuth(app)
google = oauth.remote_app(
    'google',
    consumer_key='960538357638-4jb0q7utiggp79nm146urdda67tr3vku.apps.googleusercontent.com',
    consumer_secret='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',
    request_token_params={'scope': 'email'},
    base_url='https://www.googleapis.com/oauth2/v1/',
    request_token_url=None,
    access_token_method='POST',
    access_token_url='https://accounts.google.com/o/oauth2/token',
    authorize_url='https://accounts.google.com/o/oauth2/auth',
)

# User database (for simplicity, use an in-memory dictionary)
users = {}

@app.route('/')
def index():
    if 'google_token' in session:
        user_info = google.get('userinfo')
        if user_info.data['email'] not in users:
            users[user_info.data['email']] = user_info.data['given_name']
        return render_template('index.html', user=user_info.data['given_name'])
    return render_template('index.html', user=None)

@app.route('/login')
def login():
    return google.authorize(callback=url_for('authorized', _external=True))

@app.route('/logout')
def logout():
    session.pop('google_token', None)
    return redirect(url_for('index'))

@app.route('/login/authorized')
def authorized():
    response = google.authorized_response()
    if response is None or response.get('access_token') is None:
        return 'Access denied: reason={} error={}'.format(
            request.args['error_reason'],
            request.args['error_description']
        )
    session['google_token'] = (response['access_token'], '')
    return redirect(url_for('index'))

@socketio.on('message')
def handle_message(message):
    if 'google_token' in session:
        user_info = google.get('userinfo')
        sender = user_info.data['given_name']
        emit('message', {'sender': sender, 'message': message['data']}, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True)
