#this starts applications on Windows

import os
import pyautogui
import time
from twisted.internet import task, reactor
from tkinter import *
#--------------------------------------------------------Functions-------------------------------------------------------#
def movingmouse():
    timeout = 5 # in seconds seconds
    def doWork():
        pyautogui.moveTo(559, 604, duration=.8) #change these variables / use the "duration to see"
        pyautogui.moveTo(4753, 93, duration=.8)
        pass

    l = task.LoopingCall(doWork)
    l.start(timeout) # call every # of seconds valued

    reactor.run()

def openapps():
    print('***now opening APP***')
    print('**opening APP**')
    os.system('PATH')
    print('***completed, now APP***')
    os.system('PATH')

def gitcommitprojects():
    commitmessage = input('What would you like the commit message to be?:  ')
    os.chdir('PATH')
    os.system('git add .')
    os.system('git commit -m ' + str(commitmessage))
    os.system('git push')
    print('***code has been pushed***')



def EXIT():
    print('''
    
                PROGRAM TERMINATED
    
    ''')
    COMMAND=root.destroy()

#--------------------------------------------------------WEB PAGE BELOW-------------------------------------------------------#

root = Tk()
root.title("The Apps")
root.attributes("-topmost", True)
root.geometry("250x350")

#-------------------------------------------------------Boxes and more----------------------------------------------#


#-------------------------------------------------------button function calls----------------------------------------------#

#plogF = Button(root, text="login P", command=Plog, fg="blue") #bg="orange", fg="red" for colerz
mousemoveF = Button(root, text="Mouse always moving", command=movingmouse)
openappsF = Button(root, text="Opens Slack and email", command=openapps)
gitcommitprojectsF = Button(root, text="Commit Projects folder to Github", command=gitcommitprojects)
exitF = Button(root, text="Quit Program", command=EXIT, fg="red")

#-------------------------------------------------Button locations gridding-------------------------------------------------#

mousemoveF.grid(column=1, row=5)
openappsF.grid(column=1, row=7)
gitcommitprojectsF.grid(column=1, row=9)
exitF.grid(column=1, row=25)



root.mainloop()


########notes below#########
# - Twisted internet, pyautogui modules must be downloaded