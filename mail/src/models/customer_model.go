package models

import "gorm.io/gorm"

type Customer struct{
	gorm.Model
	Id string `gorm:"not null"`
	MongoId string `gorm:"unique"`
	Name string
	Email string 
	Phone string `gorm:"unique"`
	SMS_Notification bool `gorm:"default:true"`
	EMAIL_Notification bool `gorm:"default:true"`
}
