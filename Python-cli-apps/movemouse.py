import pyautogui
import time
from twisted.internet import task, reactor

# x = pyautogui.position()
# while True:
#    x = pyautogui.position()
#    print(x)
   

timeout = 5 # Sixty seconds



def doWork():
    # x = pyautogui.position()
    # print(x)
    pyautogui.moveTo(559, 604, duration=.8) #change these variables / use the "duration to see"
    pyautogui.moveTo(4753, 93, duration=.8)
    pass

l = task.LoopingCall(doWork)
l.start(timeout) # call every sixty seconds

reactor.run()



#another way to do it:
# from time import sleep

# def hello(name):
#     print "Hello %s!" % name

# print "starting..."
# rt = RepeatedTimer(1, hello, "World") # it auto-starts, no need of rt.start()
# try:
#     sleep(5) # your long-running job goes here...
# finally:
#     rt.stop() # better in a try/finally block to make sure the program ends!