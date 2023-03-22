// Package models stores the different data schemas that we will be using throughout the backend
package models

import (
	"time"

	"QuickShare/pkg/setting"
)

// Document stores information about a file that was downloaded by the
// server.
type Document struct {
	FileId           string        // The location of the file
	Extension				string 					// The extension of the file
	ExpirationTime time.Time     // When the file should be deleted from the server
}

// NewDocument creates a document object given the path of the file that
// has already been downloaded and the time this file should exist on the
// server.
func NewDocument(fileId string, extension string, lifetime time.Duration) Document {
	return Document{
		FileId: fileId,
		Extension: extension,
		ExpirationTime: time.Now().Add(lifetime),
	}
}

func (d *Document) GetPath() string {
	return setting.ServerSetting.DownloadPath + d.FileId + d.Extension
}