// Package routers provides the HTTP endpoints for our Gin backend.
package routers

import (
	"net/http"
	"path/filepath"

	"github.com/gin-gonic/gin"

	"github.com/google/uuid"
)

func InitRouter() *gin.Engine {
	r := gin.New()

	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	r.POST("")
}