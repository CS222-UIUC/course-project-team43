// Package routers provides the HTTP endpoints for our Gin backend.
package routers

import (
	"QuickShare/routers/v1"

	"github.com/gin-gonic/gin"
)

func InitRouter() *gin.Engine {
	r := gin.New()

	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	r.POST("/upload", v1.UploadFile)
}