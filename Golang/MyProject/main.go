package main

import "fmt"

func main() {

	// Println function is used to
	// display output in the next line
	fmt.Println("Enter Your First Name: ")

	// var then variable name then variable type
	var choice string

	// Taking input from user
	fmt.Scanln(&choice)
	fmt.Println("You have selected '" + choice + "' ...Now executing")

	if choice == "1" {
		fmt.Println("Function 1 is complete")
	} else if choice == "2" {
		fmt.Println("Function 2 is complete")
	} else if choice == "3" {
		fmt.Println("Function 3 is complete")
	} else {
		fmt.Println("You have choosen a number which is not an option")
	}

}
