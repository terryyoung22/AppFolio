from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    title = 'WELCOME To my page!!'
    subtitle = 'HAVE A NICE DAY'
    description = 'SOME COOL LETTERS & THINGS HERE'
    footer = 'FOOTER TEXT'
    return render_template('index.html', title=title, subtitle=subtitle, description=description, footer=footer)

@app.route('/do_something', methods=['POST'])
def do_something():
    msg = 'Function Ran'
    print(msg)
    return msg

if __name__ == '__main__':
    app.run(host='0.0.0.0')
    # app.run(debug=True)

#https://recycledrobot.co.uk/words/?flask <--the website
