package migrate

import (
	"fmt"

	"github.com/geekyabhi/sendmailmicro/src/database/connection"
	"github.com/geekyabhi/sendmailmicro/src/models"
)

func Migrate() error{
	var err error
	err=connection.DB.AutoMigrate(&models.Customer{})
	if err!=nil{
		fmt.Print("Error while migrating Customer model")
		return err
	}
	err=connection.DB.AutoMigrate(&models.Eventdetail{})
	if err!=nil{
		fmt.Print("Error while migrating Customer model")
		return err
	}
	return nil
}