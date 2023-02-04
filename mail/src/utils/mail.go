package utils

import (
	"fmt"

	"github.com/geekyabhi/sendmailmicro/src/services"
	mailservices "github.com/geekyabhi/sendmailmicro/src/utils/mailServices"
	smsservice "github.com/geekyabhi/sendmailmicro/src/utils/smsServices"
)



func SendNotification(name string,email string,phone string,mongoId string ,event string,sms_notification bool,email_notification bool){

	if event=="profile_registered"{
		services.Add_Customer(name,email,phone,mongoId,sms_notification,email_notification)
	}

	if event=="profile_updated"{
		services.Update_One_Customer(mongoId,name,email,phone,sms_notification,email_notification)
	}

	message:=services.Find_One_Event_Detail(event)	
	user:=services.Find_One_Customer(mongoId)

	canSendMail:=user.EMAIL_Notification
	canSendMessage:=user.SMS_Notification

	if event=="profile_registered" || event=="profile_loggedin"{
		if canSendMail==true{
			mailservices.SendMail(user.Email,message.Message)
		}
		if canSendMessage==true{
			smsservice.SendSMS(user.Phone,message.Message)
		}
	}
	fmt.Println()
}