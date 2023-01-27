package initializers

import (
	"github.com/geekyabhi/sendmailmicro/config"
)

func Initialize(){
	config.LoadConfig()
}