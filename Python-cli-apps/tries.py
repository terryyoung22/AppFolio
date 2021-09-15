count = 0 
while True: 
    userName = input("Hello! Welcome to FaceSnap!Try and login! \n\nUsername: ") 
    password = input("Password: ")
    count += 1
    if count == 3: 
        #tells user bye
        print('now picing you...BAH')
        break #exit
    else:
        if userName == 'ty' and password == 'flop':
            #let them in
            print('executing program')
            break #they are in, exit loop
        else:
            #tell them it is wrong and have them retry, stay in loop
            print('its wrong...not many tries left..')