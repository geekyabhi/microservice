package utils

import (
	mailservices "github.com/geekyabhi/sendmailmicro/mailServices"
	smsservice "github.com/geekyabhi/sendmailmicro/smsService"
)



func SendNotification(name string,email string,phone string,id string ,event string){
	var canSendMail,canSendMessage bool
	var message string

	canSendMail=true
	canSendMessage=true


	if event=="register"{
		message ="Subject : Registered to microservice \n Hello "+name+" you have successfully registered to our platform"
	}

	if canSendMail==true {
		mailservices.SendMail(email,message)
	}

	if canSendMessage==true{
		smsservice.SendSMS(phone,message)
	}

}