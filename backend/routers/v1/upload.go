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
	"QuickShare/pkg/setting"
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

	if file.Size > setting.ServerSetting.MaxFileSize {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "File is too large",
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

	// Simulating saving file to store
	// TODO: Move logic for downloading file
	// into another method.
	store := c.MustGet("store").(*services.Store)

	extension := filepath.Ext(file.Filename)
	fileName := uuid.New().String()
	fileId := fileName
	if customId := c.PostForm("custom_id"); customId != "" {
		fileId = customId
	}

	if len(fileId) > 255 || len(fileId) < 4 {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "File ID length is out of bounds",
		})
		return
	}

	if store.GetDocFromStore(fileId) != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "File with this ID exists",
		})
		return
	}

	// TODO: Using 10 minutes as default duration. This should be a value we
	// receive in the frontend and access through the gin.Context.
	doc := models.NewDocument(fileId, fileName, extension, expirationTime)
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
