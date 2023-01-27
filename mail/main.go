package main

import (
	"fmt"
	"log"
	"os"

	"github.com/geekyabhi/sendmailmicro/initializers"
	"github.com/geekyabhi/sendmailmicro/utils"
)

func init(){
	initializers.Initialize()
}

func main(){
	channel,err:=utils.Connect()
	if err!=nil{
		log.Fatal(err)
		os.Exit(1)
	}
	fmt.Println("Message Service running")
	utils.Subscribe(channel)

}