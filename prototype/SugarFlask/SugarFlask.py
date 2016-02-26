from flask import Flask, render_template, request

app = Flask(__name__)


@app.route('/')
def hello_world():
    return render_template('index.html')
@app.route('/tests')
def tests():
    return render_template('tests.html')
@app.route('/home')
def home():
    return render_template('index.html')
@app.route('/main')
def main():
    name = request.args.get('name')
    return render_template('main.html',name=name)
@app.route('/future')
def future():
    return render_template('future.html')
@app.route('/questions')
def question():
    return render_template('question.html')
@app.route('/random')
def samplequestion():
    return ''
if __name__ == '__main__':
    app.run()
