from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
import webbrowser

#create selenium script below for deployment
# options = webdriver.ChromeOptions()
# options.add_argument('user-data-dir=C:/Users/tyoung1/AppData/Local/Google/Chrome/User Data/')
driver = webdriver.Chrome(executable_path='chromedriver') 
# ^no path because folder it is in is located in PATH
# ^ add: (driver,  chrome_options=options) and what is commented above if you want to use specific profile
driver.get('https://reddit.com')
#driver.maximize_window()