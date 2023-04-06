// Package routers provides the HTTP endpoints for our Gin backend.
package routers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	v1 "QuickShare/routers/v1"
	"QuickShare/services"
)

func InitRouter() *gin.Engine {
	r := gin.New()
	r.Use(services.AddToGinContext)
	r.Use(CORSMiddleware())

	r.POST("/upload", v1.UploadFile)
	r.POST("/download", v1.DownloadFile)
	r.GET("/download/:fileID", v1.DirectDownloadFile)
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"data": "Health Check!"})
	})

	return r
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
