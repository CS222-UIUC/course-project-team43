// Package v1 contains the V1 HTTP endpoints for our application
package v1

import (
	"net/http"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func DownloadFile(c *gin.Context, String fileName) {
	// file, err := c.fromFile(c.Keys.Get(fileName))
	file, err := c.fromFile("file")

	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "No file found",
		})
		return
	}

	// To be honest, I feel like there is some more stuff about streams that I'm missing
	// Just know that this is probably wrong...
	// https://stackoverflow.com/questions/22108519/how-do-i-read-a-streaming-response-body-using-golangs-net-http-package
	// All about reading from body stream on client side...

	if err := c.File("file"); err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"message": "Unable to save the file",
		})
		return
	}

	c.JSON(StatusOK, gin.H {
		"message": "File has been successfully written to body stream",
	})
}