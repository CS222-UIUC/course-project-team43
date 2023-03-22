// Package v1 contains the V1 HTTP endpoints for our application.
package v1

import (
	"encoding/json"
	"io"
	"net/http"
	"log"

	"github.com/gin-gonic/gin"

	"QuickShare/services"
)

type FileRequest struct {
	FileId string `json:"file_id"`
}

func ServeFile(c *gin.Context) {
	jsonFeed, readErr := io.ReadAll(c.Request.Body)


	if readErr != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "Error parsing input from request",
		})
		return
	}

	FileRequest := FileRequest{}
	marshalErr := json.Unmarshal([]byte(jsonFeed), &FileRequest)

	if marshalErr != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"message": "Cannot parse JSON",
		})
		return
	}

	// Obtain global store from gin.Context
	store := c.MustGet("store").(*services.Store)

	doc := store.GetDocFromStore(FileRequest.FileId) 
	if doc != nil {
		path := doc.GetPath()
		log.Printf("Serving file: %v", path)
		c.File(path)
		return
	}

	c.JSON(http.StatusBadRequest, gin.H{
		"message": "File not found",
	})
}

/*
passing a json to gon framework
*/
