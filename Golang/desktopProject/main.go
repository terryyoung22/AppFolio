package main

import (
	"fmt"
	"net/http"
	"log"
	"os/exec"
    "runtime"
	// "io/ioutil"
 )

func main() {

	// var then variable name then variable type
	var choice string

	// Println function is used to
	// display output in the next line
	fmt.Println("What Choice will you select: ")


	// Taking input from user
	fmt.Scanln(&choice)
	fmt.Println("You have selected '" + choice + "' ...Now executing")

	if choice == "1" {
		MakeRequest()
		fmt.Println("Function 1 is complete") // Add the option for input
	} else if choice == "2" {
		if runtime.GOOS == "windows" {
			fmt.Println("Can't Execute this on a windows machine")
		} else {
			execute()
		}
		fmt.Println("Function 2 is complete")
	} else if choice == "3" {
		fmt.Println("Function 3 is complete")
	} else {
		fmt.Println("You have choosen a number which is not an option")
	}

}

// Function Farm


func MakeRequest() {

    resp, err := http.Get("https://golangcode.com")
    if err != nil {
        log.Fatal(err)
    }

    // Print the HTTP Status Code and Status Name
    fmt.Println("HTTP Response Status:", resp.StatusCode, http.StatusText(resp.StatusCode))

    if resp.StatusCode >= 200 && resp.StatusCode <= 299 {
        fmt.Println("HTTP Status is in the 2xx range")
    } else {
        fmt.Println("NO RESPONSE!")
    }
}

func execute() {

    out, err := exec.Command("ls").Output()

    // if there is an error with our execution handle here
    // handle it here
    if err != nil {
        fmt.Printf("%s", err)
    }

    fmt.Println("Command Successfully Executed")
    output := string(out[:])
    fmt.Println(output)

    out, err = exec.Command("pwd").Output()
    if err != nil {
        fmt.Printf("%s", err)
    }
    fmt.Println("Command Successfully Executed") //Look at combining the 2 commands
    output = string(out[:])
    fmt.Println(output)
}




//////Retired Code///////////
// func MakeRequest() {
// 	resp, err := http.Get("https://google.com")
// 	if err != nil {
// 		log.Fatalln(err)
// 	}

// 	body, err := ioutil.ReadAll(resp.Body)
// 	if err != nil {
// 		log.Fatalln(err)
// 	}

// 	log.Println(string(body))
// }



