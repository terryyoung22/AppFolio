import requests
import json

# vars = input('') -- can make the vars within data be inputs


securePasswordGeneratorAPI = "https://9n80263qhk.execute-api.us-east-1.amazonaws.com/prod" # -- API of mine to try
data = {

    "length": 10,
    "capitals" :2,
    "numbers": 2
}
response = requests.post(securePasswordGeneratorAPI, json.dumps(data))
resp = json.loads(response.content)
generatedPassword = resp["body"]
print(generatedPassword)

# You can use Postman to make a call to this api with the above vars as well instead of this. Just make the data the body in Postman

# I would like to put a front end in front of this