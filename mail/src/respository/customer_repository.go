package respository

import (
	"github.com/geekyabhi/sendmailmicro/src/database/connection"
	"github.com/geekyabhi/sendmailmicro/src/models"
)

func Add_Customer(id string, name string ,phone string ,email string , sms_notification bool , email_notification bool,mongoId string) (*models.Customer ,error){
	
	customer:=models.Customer{
		Id:id,		
		MongoId: mongoId,
		Name: name,
		Email: email,
		Phone: phone,
		SMS_Notification: sms_notification,
		EMAIL_Notification: email_notification,
	}

	customer_result:=connection.DB.Create(&customer)
	if customer_result.Error!=nil{
		return nil,customer_result.Error
	}
	return &customer,nil
}

func Find_One_Customer(mongoId string,name string ,phone string,id string,email string) *models.Customer{
	var customer models.Customer
	connection.DB.Where(&models.Customer{MongoId: mongoId,Email: email,Phone: phone,Name: name,Id: id}).First(&customer)
	return &customer
}

func Find_All_Customer(mongoId string,name string ,phone string,id string,email string)[]models.Customer{
	var customers []models.Customer
	connection.DB.Where(&models.Customer{MongoId: mongoId,Email: email,Phone: phone,Name: name,Id: id}).Find(&customers)
	return customers
}

func Update_One_Customer(mongoId string,name string ,phone string,email string, sms_notification bool , email_notification bool) {
	connection.DB.Model(&models.Customer{}).Where("mongo_id = ? ",mongoId).Updates(
		map[string]interface{}{"name":name,"phone":phone,"email":email,"sms_notification":sms_notification,"email_notification":email_notification})
}