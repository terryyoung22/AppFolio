import os

##### Hello #####
print('Hello...I am now using the default or current exported AWS profile.')
print('If you dont have an AWS Profile exported, please close this, export, and then re-run this.')
answer = input(''' 
Would you like me to do? --select a number below--:
1. Cloudtrail Logs (last 10 events exported)
2. Cloudwatch Logs (Coming Soon)
3. Both

answer: ''')


if answer == '1':
    os.system('aws cloudtrail lookup-events --max-results 10 > cloudtrail.txt')
    print('Your Cloudtrail Logs were exported to the current directory')
elif answer == '2':
    print('.....ITS COMING!!!')
elif answer is not '1' or '2':
    print('Pulling both...Please wait...')
    os.system('aws cloudtrail lookup-events --max-results 10 > cloudtrail.txt')
    print('Your Cloudtrail have been pulled, and Cloudwatch logs feature is on its way')