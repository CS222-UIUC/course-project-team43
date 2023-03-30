// Package routers provides the HTTP endpoints for our Gin backend.
package routers

import (
	"encoding/json"
	"net/http"
	"os"
	"time"

	ginzap "github.com/gin-contrib/zap"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"

	"QuickShare/pkg/setting"
	v1 "QuickShare/routers/v1"
	"QuickShare/services"
)

func InitRouter() *gin.Engine {
	r := gin.New()

	zapConfFile, _ := os.Open(setting.ServerSetting.ZapConfPath)
	defer zapConfFile.Close()
	data := make([]byte, 0)
	buffer := make([]byte, 1024)
	for {
		n, err := zapConfFile.Read(buffer)
		if n == 0 || err != nil {
			break
		}
		data = append(data, buffer[:n]...)
	}

	var zapConf zap.Config
	if err := json.Unmarshal(data, &zapConf); err != nil {
		panic(err)
	}
	logger := zap.Must(zapConf.Build()) // Build the logger

	r.Use(ginzap.Ginzap(logger, time.RFC3339, true))
	r.Use(ginzap.RecoveryWithZap(logger, true))
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
