// Package v1 contains the V1 HTTP endpoints for our application.
package v1

import (
	"net/http"
	"path/filepath"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"QuickShare/models"
	"QuickShare/services"
)

type UploadResponse struct {
	Expiration int64  `json:"expiration"`
	FileId     string `json:"file_id"`
}

func UploadFile(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "No file was received",
		})
		return
	}

	expiry := c.PostForm("expiration")
	// convert expiration to time.Time, if "" then zero time
	expirationTime := time.Time{}
	if expiry != "" {
		// epxiration time is in milliseconds since epoch
		var asInteger, err = strconv.ParseInt(expiry, 10, 64)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
				"message": "Invalid expiration time",
			})
			return
		}
		expirationTime = time.UnixMilli(asInteger)

	}

	extension := filepath.Ext(file.Filename)
	fileId := uuid.New().String()

	// Simulating saving file to store
	// TODO: Move logic for downloading file
	// into another method.
	store := c.MustGet("store").(*services.Store)
	// TODO: Using 10 minutes as default duration. This should be a value we
	// receive in the frontend and access through the gin.Context.
	doc := models.NewDocument(fileId, extension, expirationTime)
	store.AddToStore(doc)

	// Save the file
	if err := c.SaveUploadedFile(file, doc.GetPath()); err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"message": "Unable to save the file",
		})
		return
	}

	// File saved succesfully
	c.JSON(http.StatusOK, UploadResponse{
		Expiration: expirationTime.UnixMilli(),
		FileId:     fileId,
	})
}
