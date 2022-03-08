package main

import (
    "log"
    "os/exec"
)

func main() {

    cmd := exec.Command("go run http.go")

    err := cmd.Run()

    if err != nil {
        log.Fatal(err)
    }
}
