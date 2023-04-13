import json
import random

def generate_password(length, n_capitals, n_numbers):
    capitals = random.choices('ABCDEFGHIJKLMNOPQRSTUVWXYZ', k = n_capitals)
    numbers = random.choices('0123456789', k = n_numbers)
    letters = random.choices('abcdefghijklmnopqrstuvwxyz', k = length - n_capitals - n_numbers)
    password = capitals + numbers + letters
    random.shuffle(password)
    return str("".join(password))

def lambda_handler(event, context):

    if not 'length' in event or not 'n_capitals' in event or not 'n_numbers' in event:
        return {
            'statusCode': 200,
            'body': json.dumps('Error: Please specify all parameters (length, n_capitals, n_numbers).')
        }
    
    password = generate_password(event['length'], event['capitals'], event['numbers'])
    
    return {
        'statusCode': 200,
        'body': password
    }