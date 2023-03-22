// Package v1 contains the V1 HTTP endpoints for our application.
package v1

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"

	"QuickShare/services"
)

type FileName struct {
	FileName string `json:"FileName"`
}

func ServeFile(c *gin.Context) {
	jsonFeed, readErr := io.ReadAll(c.Request.Body)

	if readErr != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "Error parsing input from request",
		})
		return
	}

	FileName := FileName{}
	marshalErr := json.Unmarshal([]byte(jsonFeed), &FileName)

	if marshalErr != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"message": "Cannot parse JSON",
		})
		return
	}

	// Fetch global store from store.go
	store := c.MustGet("store").(*services.Store)

	if store.IsDocPathInStore(FileName.FileName) {
		http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
			http.ServeFile(w, r, FileName.FileName)
		})

		err := http.ListenAndServe(":8080", nil)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
				"message": "Unable to serve file",
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "File successfuly served",
		})
	}

	c.JSON(http.StatusBadRequest, gin.H{
		"message": "File not found",
	})
}

/*
passing a json to gon framework
*/
