// Package v1 contains the V1 HTTP endpoints for our application.
package v1

import (
	"mime/multipart"
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
	fileHeader, err := c.FormFile("file")
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "No file was received",
		})
		return
	}

	if fileHeader.Size > setting.ServerSetting.MaxFileSize {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "File is too large",
		})
		return
	}

	expiration, err := getExpiration(c)
	if err != nil {
		return
	}

	fileId := uuid.New().String()
	fileName := getFileId(c)
	if fileName == "" {
		fileName = fileId
	}

	extension := filepath.Ext(fileHeader.Filename)
	compress := shouldCompress(extension)

	// Add to store
	store := c.MustGet("store").(*services.Store)

	doc := models.NewDocument(fileId, fileName, extension, expiration, compress)
	store.AddToStore(doc)

	if err := handleWriting(c, fileHeader, doc); err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"message": "Unable to save the file",
		})
		return
	}

	// File saved succesfully
	c.JSON(http.StatusOK, UploadResponse{
		Expiration: expiration.UnixMilli(),
		FileId:     fileId,
	})
}

func handleWriting(c *gin.Context, fileHeader *multipart.FileHeader, doc *models.Document) error {
	if doc.Compressed {
		return services.CompressAndWrite(fileHeader, doc.GetPath())
	} else {
		return c.SaveUploadedFile(fileHeader, doc.GetPath())
	}
}

// Gets / validates the expiry
// If there is an error, this function handles
// writing the error message to the gin context
func getExpiration(c *gin.Context) (time.Time, error) {
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
			return time.Time{}, err
		}
		expirationTime = time.UnixMilli(asInteger)
	}

	return expirationTime, nil
}

// Gets / validates the customId
// If there is an error, this function handles
// writing the error to the gin context.
func getFileId(c *gin.Context) string {
	fileId := c.PostForm("custom_id")

	if fileId == "" {
		// A fileId was not provided, so use the UUID
		return ""
	}

	// A customId was provided, perform error checking
	if len(fileId) > 255 || len(fileId) < 4 {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "File ID length is out of bounds",
		})
		return ""
	}

	store := c.MustGet("store").(*services.Store)
	if store.GetDocFromStore(fileId) != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "File with this ID exists",
		})
		return ""
	}

	return fileId
}

func shouldCompress(extension string) bool {
	// This obviously is not comprehensive.
	return extension == ".txt" || extension == ".pdf" || extension == ".cpp" || extension == ".h"
}
