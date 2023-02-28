// Package routers provides the HTTP endpoints for our Gin backend.
package routers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"QuickShare/routers/v1"
)

func InitRouter() *gin.Engine {
	r := gin.New()

	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	r.POST("/upload", v1.UploadFile)
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"data": "Health Check!"})
	})

	return r
}
	