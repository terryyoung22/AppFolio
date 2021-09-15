import smtplib

TO = input('Who would you like to send an email to:  ')
SUBJECT = input('What would you like the subject title to be:  ')
TEXT = input('What would you like the email to say:  ')

# Gmail Sign In
gmail_sender = 'myemail'
gmail_passwd = input('Password to your email account:  ')

server = smtplib.SMTP('smtp.gmail.com', 587)
server.ehlo()
server.starttls()
server.login(gmail_sender, gmail_passwd)

BODY = '\r\n'.join(['To: %s' % TO,
                    'From: %s' % gmail_sender,
                    'Subject: %s' % SUBJECT,
                    '', TEXT])

try:
    server.sendmail(gmail_sender, [TO], BODY)
    print ('***EMAIL HAS BEEN SENT***')
except:
    print ('-----error sending mail-----')

server.quit()