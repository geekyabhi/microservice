package mailservices

import (
	"fmt"
	"log"
	"net/smtp"
)

func SendMail(toEmail string,message string){
	auth := smtp.PlainAuth("","thakurabhinav17122001@gmail.com","imtmcsiugniksrkg","smtp.gmail.com")
	err:=smtp.SendMail("smtp.gmail.com:587",auth,"thakurabhinav17122001@gmail.com",[]string{toEmail},[]byte(message))

	if err !=nil{
		log.Fatalf("Error while sending mail to %s\n",toEmail)
	}

	if err ==nil{
		fmt.Printf("Mail sent to %s\n",toEmail)
	}
}