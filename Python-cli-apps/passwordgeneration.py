# randomly generates a strong password every time you run the program
 
import string
import random
lowercase = string.ascii_lowercase
uppercase = string.ascii_uppercase
special_chars = string.punctuation
numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
 
'''
got these requirements from some random business website (Workzone):
MUST contain at least 8 characters (12+ recommended)
MUST contain at least one uppercase letter.
MUST contain at least one lowercase letter.
MUST contain at least one number.
MUST contain at least one special character.
'''
 
def pick_random_number(int_list):
    # picks random element from the list
    # of integers int_list
    i = random.choice(int_list)
    return i
 
def pick_random_element_from_string(str1):
    # picks random element from the string str1,
    # since strings can be manipulated like lists,
    str2 = random.choice(str1)
    return str2
 
print("STRONG PASSWORD GENERATOR")
print('\t')
print("A strong password:")
print('''MUST contain at least 8 characters (12+ recommended).\n
MUST contain at least one uppercase letter.\n
MUST contain at least one lowercase letter.\n
MUST contain at least one number.\n
MUST contain at least one special character.\n''')
print("\t")
p = input("Press 'C' to generate a strong password; press any other key to exit. ")
p = p.upper()
 
if p != 'C':
    exit(1)
 
pass_word = "" # the password string
 
# picks 4 random elements - a lowercase char, an uppercase char, a special character, and a number
_lower_ = pick_random_element_from_string(lowercase)
_upper_ = pick_random_element_from_string(uppercase)
_special_ = pick_random_element_from_string(special_chars)
str_num = str(pick_random_number(numbers))
 
# picks 4 more different random elements - a lowercase char, an uppercase char, a special character, and a number
_lower1_ = pick_random_element_from_string(lowercase)
_upper1_ = pick_random_element_from_string(uppercase)
_special1_ = pick_random_element_from_string(special_chars)
str_num1 = str(pick_random_number(numbers))
 
# picks 4 more different random elements - a lowercase char, an uppercase char, a special character, and a number
_lower2_ = pick_random_element_from_string(lowercase)
_upper2_ = pick_random_element_from_string(uppercase)
_special2_ = pick_random_element_from_string(special_chars)
str_num2 = str(pick_random_number(numbers))
 
# concatenates each set of random elements to the pass_word string to create the final password
pass_word = pass_word + _lower_ + _upper_ + _special_ + str_num
pass_word = pass_word + _lower1_ + _upper1_ + _special1_ + str_num1
pass_word = pass_word + _lower2_ + _upper2_ + _special2_ + str_num2
 
print("PASSWORD: {}".format(pass_word))
print("Be sure to write your new password down, because when you run the program again, it'll be lost forever.")
