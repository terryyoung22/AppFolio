import socket

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server = 'google.com'

def pscan(port):
    try:
        #you can try this too: s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.connect((server, port))
        return True
    except:
        return False
        
for x in range(1,26): #can change the ports
    if pscan(x):
        print('"port" + x + "is open!!!!!!!!!!!!!"')
    else:
        print('"port" + x + "is closed"')
