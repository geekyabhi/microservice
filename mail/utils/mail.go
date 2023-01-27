package utils

import "fmt"


func SendMail(name string,email string,phone string,id string ,event string){
	fmt.Printf("Mail sent to %s with email => %s id=> %s \n",name,email,id)
}