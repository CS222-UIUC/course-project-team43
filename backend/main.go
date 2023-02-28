package main

import (
	"QuickShare/service"

	"net/http"
	"github.com/gin-gonic/gin"
)

// This function gets run on the program startup, before main
// and is used to initiliaze resources.
func init() {

}

func main() {
	gin.SetMode()


	log.Printf("[info] starting http server")


}