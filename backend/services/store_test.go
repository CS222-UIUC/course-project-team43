package services

import (
	"QuickShare/models"
	"QuickShare/pkg/setting"
	"os"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func init() {
	setting.Setup("../conf/app.ini")
}

func TestStore(t *testing.T) {
	doc := models.NewDocument("test1", ".txt", time.Now().Add(time.Minute))
	if _, err := os.Create(doc.GetPath()); err != nil {
		t.Fatalf("Error creating file: %v", err)
	}

	s.AddToStore(doc)
	assert.Equal(t, 1, len(s.documents), "Store should have a single document")

	s.sweep(time.Now())
	assert.Equal(t, 1, len(s.documents), "Early sweep should not remove document")

	s.RemoveFile(doc.FileId)
	assert.Equal(t, 0, len(s.documents), "Should have removed document")
	_, err := os.Stat(doc.GetPath())
	assert.Error(t, err, "File should be removed from fs")

	s.AddToStore(doc)
	s.sweep(time.Now().Add(time.Minute))
	assert.Equal(t, 0, len(s.documents), "Sweep after expiry should remove file")
}
