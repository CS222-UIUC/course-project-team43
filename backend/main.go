package main

import (
	"net/http"
	"log"
	"fmt"

	"github.com/gin-gonic/gin"

	"QuickShare/routers"
	"QuickShare/pkg/setting"
)

// This function gets run on the program startup, before main
// and is used to initiliaze resources.
func init() {
	setting.Setup()
}

func main() {
	gin.SetMode(setting.ServerSetting.RunMode)

	routersInit := routers.InitRouter()
	readTimeout := setting.ServerSetting.ReadTimeout
	writeTimeout := setting.ServerSetting.WriteTimeout
	endPoint := fmt.Sprintf(":%d", setting.ServerSetting.HttpPort)

	server := &http.Server{
		Addr:	endPoint,
		Handler: routersInit,
		ReadTimeout: readTimeout,
		WriteTimeout: writeTimeout,
	}

	log.Printf("[info] starting http server")

	server.ListenAndServe()
}