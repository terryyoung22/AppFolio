import base64

print('Do you want to Encrypt or Decrypt a password?')
choice = str.upper(input('Encrypt(E) / Decrypt(D):  '))

if choice == 'E':
    mypassword = input('What password needs to be encrypted:  ').encode('utf-8')
    base64_bytes = base64.b64encode(mypassword)
    #print(base64_bytes + ' <-- use what is in quotes for decoding')
    print(base64_bytes.decode('utf-8') + ' <-- Use this for decoding') 
elif choice == 'D':
    mypasswordD = input('What needs to be decoded:  ')
    #decode,,,, base64_bytes pulling from above, you can post your own integers in
    base64_decoded_bytes = base64.b64decode(mypasswordD)
    #base64_decoded_bytes = base64.decodebytes(base64_bytes)
    print(base64_decoded_bytes.decode())
else:
    print('YOU DID NOT CHOOSE AN OPTION....ENDING')
        
   #remove spaces from before the lines. Match if and else statments to eachother at edge of code 
