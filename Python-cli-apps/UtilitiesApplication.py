#RUNS IN PYTHON3
import os
import pyautogui
import time
import base64
import shutil
from getpass import getpass
from pathlib import Path
from os import listdir
from os.path import isfile, join
from tkinter import *
import tkinter.messagebox
import PIL.Image
import PIL.ImageTk
import numpy as np
import cv2

# notes to for public:
# change path for anything with '/path/to/' to whatever your path is


def testing(): #mouseposition--used as reference for popup box
    print('do you want mouse position?:  ')
    tkinter.messagebox.showinfo('**ACTION NEEDED**', 'Incoming Message')
    answer = tkinter.messagebox.askquestion('**ACTION NEEDED**', 'yes or no?')
    if answer == 'yes':
        print(pyautogui.position())
        print('here is your mouses position')
    else:
        print('You have decided to not find...')

def loginp(): #works, must change the layout
    password = passi.get()
    if password == 'PASSWORD HERE':
        os.system("python ./login.py")
    else:
        os.system('python ./picturefunction.py')
        print('incorrect')

def CREATION(): #Foldercreation.py
    from time import sleep
    print('Currently making folder on desktop called "NEWFOLDERCREATED"...')
    sleep(5) #using time module
    os.mkdir('/path/to/NEWFOLDERCREATED')
    print('NEW FOLDER HAS BEEN CREATED!!!')
    #begin open of new folder creation
    pyautogui.hotkey('command', 'space')
    pyautogui.typewrite('NEWFOLDERCREATED', interval=.2)
    pyautogui.press('enter')

def MOVEVIDEOS(): #Moving videos files

    print('PLEASE WAIT...Moving files now...')
    time.sleep(1.5) #time module
    sourcepath='/path/to/Downloads'
    sourcefiles = os.listdir(sourcepath)
    destinationpath = '/path/to/movs'
    #secondpath='//Users//tyoung//Documents//moviesmoving'   was gonna do for like the first part

    for file in sourcefiles:
        if file.startswith('variable-here') or file.endswith('.anyextention'):
            shutil.move(os.path.join(sourcepath,file), os.path.join(destinationpath,file))
            print('Your File have been moved!')
    print('-----Now executing Second move-----')

    mypath = '//path/to/destination'
    onlyfiles = [f for f in listdir(mypath) if isfile(join(mypath, f))]
    print(len(onlyfiles))
    print('^^Files are in that directory^^')
    if len(onlyfiles) == 0:
        print('***There was nothing to be moved in second file location***')
    else:
        os.system('mv /path/to/') #will be used if anything is put in
    print('***ALL FILES HAVE BEEN TRANSFERED***')

def PushcodestogitED():
    os.chdir('/path/to/')
    os.system('git add .')
    os.system('git commit -m "push from pythonED"')
    # tkinter.messagebox.showinfo('**ACTION NEEDED**', 'Please enter password to push')
    os.system('git push')
    print('##########--YOUR CODEZ HAVE BEEN PUSHED TO PRIVATE GIT REPO--##########')
    #tkinter.messagebox.showinfo('**ACTION NEEDED**', 'THIS IS UNDER CONTRUCTION:')

def PushcodestogitLocal():
    os.chdir('/path/to/')
    os.system('git add -a')
    os.system('git commit -m "push from pythonLocal"')
    # tkinter.messagebox.showinfo('**ACTION NEEDED**', 'Please enter password to push')
    os.system('git push')
    print('##########--YOUR CODEZ HAVE BEEN PUSHED TO PRIVATE GIT REPO--##########')
    #tkinter.messagebox.showinfo('**ACTION NEEDED**', 'THIS IS UNDER CONTRUCTION:')

def GVLog(): #Not listed in buttons, will add later
   os.system("python3 /path/to/GVlogin.py")

def GithubL(): #Not listed in buttons, will add later
   os.system("python3 /path/to/GithubLogin.py")

def ScreenshotCurrent():
    import datetime
    os.system("screencapture screen.png")
    os.system("mv screen.png /path/to/pythonSS")
    print('!!!!SCREEN SHOT TAKEN!!!!')

    os.chdir("/path/to/pythonSS")
    print('directory changed...now renaming')
    dt = str(datetime.datetime.now())

    newname = 'Screenshot'+dt+'.jpg'
    os.rename('screen.png', newname)

def picturetime(): #must add in datetime input for this
    os.system('python /path/to/picturefunction.py')

def passwordencrypter():
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

def message():
    pyautogui.hotkey('command', 'space')
    pyautogui.typewrite('messages')
    pyautogui.press('enter')

def createTXT():
    os.chdir('/path/to/')
    file = open("NEWFILE.txt", "w") 
    file.write("Your text goes here") 
    file.close()

def EXIT():
    print('''
    
                PROGRAM TERMINATED
    
    ''')
    COMMAND=root.destroy()
#--------------------------------------------------------WEB PAGE BELOW-------------------------------------------------------#

root = Tk()
root.title("The Apps")
root.attributes("-topmost", True)
root.geometry("500x350")

# im = PIL.Image.open("Arch.jpg")
# photo = PIL.ImageTk.PhotoImage(im)
# label = Label(root, image=photo, width = 400, height = 100)
# label.image = photo  # keep a reference!
#label.grid(column=1, row=50) needs to find a better pattern on how to lay it


#-------------------------------------------------------Boxes and more----------------------------------------------#
passi = Entry(root,width=6) #entry box with grids below

#-------------------------------------------------------button function calls----------------------------------------------#

#plogF = Button(root, text="login P", command=Plog, fg="blue") #bg="orange", fg="red" for colerz
loginpF = Button(root, text="NEW login P", command=loginp)
creationF = Button(root, text="Create a folder", command=CREATION, fg="blue")
moveFilesF = Button(root, text="Movie Downloaded Vidz", command=MOVEVIDEOS, fg="blue")
pushgitED = Button(root, text="Github ED push", command=PushcodestogitED, fg="blue")
pushgitL = Button(root, text="Github Local push", command=PushcodestogitLocal, fg="blue")
screenshotC = Button(root, text="Screenshot Current Page", command=ScreenshotCurrent)
picturetimeF = Button(root, text="Take a picture", command=picturetime, fg="blue")
messageF = Button(root, text="Text", command=message, fg="blue")
createtextF = Button(root, text="create text document", command=createTXT, fg="blue")
gvloginF = Button(root, text="gvlogin", command=GVLog, fg="blue")
passWencrypt = Button(root, text="Encrypt/Decrypt PW", command=passwordencrypter, fg="blue")
exitF = Button(root, text="Quit Program", command=EXIT, fg="blue")

#-------------------------------------------------Button locations gridding-------------------------------------------------#
#rows depeining on where placement is within the column you choose:

loginpF.grid(column=1, row=5) #col=1 is for input codes and exit
passi.grid(column=1, row=4)
exitF.grid(column=1, row=25)

#plogF.grid(column=8, row=4) #make changes///////colm=8 is for push exe
gvloginF.grid(column=8, row=4)
creationF.grid(column=8, row=5)
moveFilesF.grid(column=8, row=6)
pushgitED.grid(column=8, row=7)
pushgitL.grid(column= 8, row=8)

screenshotC.grid(column=10, row=4)
picturetimeF.grid(column=10, row=5)
passWencrypt.grid(column=10, row=6)
messageF.grid(column=10, row=7)
createtextF.grid(column=10, row=8)

root.mainloop()
