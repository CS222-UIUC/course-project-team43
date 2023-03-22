// Package models stores the different data schemas that we will be using throughout the backend
package models

import (
	"time"
)

// Document stores information about a file that was downloaded by the
// server.
type Document struct {
	Path           string        // The location of the file
	ExpirationTime time.Time     // When the file should be deleted from the server
}

// NewDocument creates a document object given the path of the file that
// has already been downloaded and the time this file should exist on the
// server.
func NewDocument(path string, lifetime time.Duration) Document {
	return Document{
		Path:           path,
		ExpirationTime: time.Now().Add(lifetime),
	}
}