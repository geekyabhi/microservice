package services

import (
	"os/exec"

	"github.com/geekyabhi/sendmailmicro/src/models"
	"github.com/geekyabhi/sendmailmicro/src/respository"
)

func Add_Customer(name string, email string ,phone string, mongoId string , sms_notification bool , email_notification bool)(*models.Customer,error){
	uuid ,err := exec.Command("uuidgen").Output()
	if err!=nil{
		return nil,err
	}
	id := string(uuid)

	result,err:=respository.Add_Customer(id,name,phone,email,sms_notification,email_notification,mongoId)
	if err!=nil{
		return nil,err
	}
	return result,nil
}

func Find_One_Customer(mongoId string)*models.Customer{
	result:=respository.Find_One_Customer(mongoId,"","","","")
	return result
}

func Update_One_Customer(mongoId string , name string,email string ,phone string,sms_notification bool, email_notification bool){
	respository.Update_One_Customer(mongoId,name,phone,email,sms_notification,email_notification)
}