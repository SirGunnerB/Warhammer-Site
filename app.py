from flask import Flask, render_template
from datetime import datetime

app = Flask(__name__)

# Sample data - In a real application, this would come from a database
SAMPLE_UPDATES = [
    {
        'title': 'The Siege of Terra',
        'description': 'New details about the epic conclusion of the Horus Heresy',
        'image': '/assets/images/siege-of-terra.jpg'
    },
    {
        'title': 'Primaris Space Marines',
        'description': "Evolution of the Emperor's finest warriors",
        'image': '/assets/images/primaris.jpg'
    },
    {
        'title': 'The Great Rift',
        'description': 'How the galaxy was torn asunder',
        'image': '/assets/images/great-rift.jpg'
    }
]

@app.route('/')
def home():
    return render_template('landing.html', 
                         latest_updates=SAMPLE_UPDATES,
                         current_year=datetime.now().year)

@app.route('/battles')
def battles():
    return render_template('content-page.html',
                         page_title='Notable Battles',
                         page_description='Explore the most significant conflicts in the Warhammer 40,000 universe.',
                         last_updated=datetime.now().strftime('%Y-%m-%d'),
                         page_class='battles-page')

@app.route('/factions')
def factions():
    return render_template('content-page.html',
                         page_title='Factions',
                         page_description='Learn about the various factions vying for control in the 41st millennium.',
                         last_updated=datetime.now().strftime('%Y-%m-%d'),
                         page_class='factions-page')

@app.route('/characters')
def characters():
    return render_template('content-page.html',
                         page_title='Characters',
                         page_description='Meet the legendary heroes and villains of the Warhammer 40,000 universe.',
                         last_updated=datetime.now().strftime('%Y-%m-%d'),
                         page_class='characters-page')

@app.route('/ships')
def ships():
    return render_template('content-page.html',
                         page_title='Ships',
                         page_description='Explore the mighty vessels that traverse the void in the 41st millennium.',
                         last_updated=datetime.now().strftime('%Y-%m-%d'),
                         page_class='ships-page')

@app.route('/timeline')
def timeline():
    return render_template('content-page.html',
                         page_title='Timeline',
                         page_description='Journey through the major events that shaped the Warhammer 40,000 universe.',
                         last_updated=datetime.now().strftime('%Y-%m-%d'),
                         page_class='timeline-page')

if __name__ == '__main__':
    app.run(debug=True, port=8000)
