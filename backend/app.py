from flask import Flask, jsonify, request
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

# Game state storage
games = {}

@app.route('/api/game/new', methods=['POST'])
def new_game():
    """Start a new game and return a game ID"""
    game_id = str(random.randint(1000, 9999))
    secret_number = random.randint(1, 500)
    games[game_id] = {
        'secret': secret_number,
        'attempts': 0,
        'max_attempts': 10,
        'history': []
    }
    return jsonify({
        'game_id': game_id,
        'max_attempts': 10,
        'message': 'New game started! Guess a number between 1 and 500.'
    })

@app.route('/api/game/guess', methods=['POST'])
def make_guess():
    """Process a guess and return feedback"""
    data = request.json
    game_id = data.get('game_id')
    guess = data.get('guess')
    
    if game_id not in games:
        return jsonify({'error': 'Invalid game ID'}), 400
    
    game = games[game_id]
    
    # Check for duplicate guess
    if guess in game['history']:
        # Return too_low or too_high to maintain color consistency
        if guess < game['secret']:
            result = 'too_low'
            hint = 'Too low!'
        else:
            result = 'too_high'
            hint = 'Too high!'
        return jsonify({
            'result': result,
            'message': "You've already picked this number. Pick another one.",
            'hint': hint,
            'attempts': game['attempts'],
            'max_attempts': game['max_attempts'],
            'history': game['history'],
            'winning_guess': None
        })
    
    game['attempts'] += 1
    
    if guess == game['secret']:
        result = 'correct'
        message = f'Congratulations! You guessed the number in {game["attempts"]} attempts!'
        game['history'].append(guess)  # Add winning guess to history
        del games[game_id]  # Clean up completed game
    elif game['attempts'] >= game['max_attempts']:
        result = 'lost'
        message = f'Game over! The number was {game["secret"]}.'
        del games[game_id]
    elif guess < game['secret']:
        result = 'too_low'
        message = 'Too low! Try again.'
        game['history'].append(guess)
    else:
        result = 'too_high'
        message = 'Too high! Try again.'
        game['history'].append(guess)
    
    return jsonify({
        'result': result,
        'message': message,
        'attempts': game['attempts'],
        'max_attempts': game['max_attempts'],
        'history': game['history'],
        'winning_guess': guess if result == 'correct' else None
    })

@app.route('/api/game/status/<game_id>', methods=['GET'])
def game_status(game_id):
    """Get the current status of a game"""
    if game_id not in games:
        return jsonify({'error': 'Invalid game ID'}), 400
    
    game = games[game_id]
    return jsonify({
        'attempts': game['attempts'],
        'max_attempts': game['max_attempts'],
        'history': game['history']
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
