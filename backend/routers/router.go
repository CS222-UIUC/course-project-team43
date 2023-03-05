// Package routers provides the HTTP endpoints for our Gin backend.
package routers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"QuickShare/routers/v1"
	"QuickShare/services"
)

func InitRouter() *gin.Engine {
	r := gin.New()

	r.Use(gin.Logger())
	r.Use(gin.Recovery())
	r.Use(services.AddToGinContext)

	r.POST("/upload", v1.DownloadFile)
	r.POST("/serve", v1.ServeFile)
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"data": "Health Check!"})
	})

	return r
}
