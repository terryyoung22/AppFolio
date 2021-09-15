from pathlib import Path
from os import listdir
from os.path import isfile, join

print('Would you like to specify a path?')
answer = str.upper(input('Yes(Y) or No(N):  '))

if answer == 'Y': #make sure when inpu
    print('please specify path:')
    pathw = input('PATH(Make sure to use "//" slashes): ')
    onlyfiles = [f for f in listdir(pathw) if isfile(join(pathw, f))]
    print(len(onlyfiles))
else:
    mypath = '/path/to/'
    onlyfiles = [f for f in listdir(mypath) if isfile(join(mypath, f))]
    print(len(onlyfiles))
