package services

import (
	"os"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"

	"QuickShare/models"
)

const SweepInterval = time.Second * 30

// Store tracks information about the files that are currently
// downloaded onto the server.
type Store struct {
	mu        sync.Mutex
	documents map[string]*models.Document
}

func newStore() *Store {
	s := Store{
		documents: make(map[string]*models.Document),
	}
	// Begin background sweep goroutine
	go s.sweepLoop()
	return &s
}

// Loop to clear old files on a regular interval
func (s *Store) sweepLoop() {
	t := time.NewTicker(SweepInterval)
	for currTime := range t.C {
		s.sweep(currTime)
	}
}

// Perform sweep by removing expired files
func (s *Store) sweep(currTime time.Time) {
	s.mu.Lock()
	defer s.mu.Unlock()

	var removedFiles []string

	for path, doc := range s.documents {
		if currTime.After(doc.ExpirationTime) && !doc.ExpirationTime.IsZero() {
			s.removeFile(path)
			removedFiles = append(removedFiles, path)
		}
	}

	zap.S().Info("removedFiles:", removedFiles)
	utilization := s.calculateDiscUtilization()
	zap.S().Info("discUtilization:", utilization)
}

func (s *Store) AddToStore(doc *models.Document) {
	s.mu.Lock()
	defer s.mu.Unlock()

	// Add link to the global links
	s.documents[doc.FileHash] = doc
	s.PrintDocuments()
}

func (s *Store) PrintDocuments() {
	var documents []string
	for _, doc := range s.documents {
		documents = append(documents, doc.GetPath())
	}
	zap.S().Info("documents:", documents)
}

func (s *Store) GetDocFromStore(fileId string) *models.Document {
	return s.documents[fileId]
}

func (s *Store) RemoveFile(path string) {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.removeFile(path)
}

// precondition: we have acquired the mutex lock
func (s *Store) removeFile(fileId string) {
	doc := s.documents[fileId]
	if doc != nil {
		os.Remove(doc.GetPath())
		delete(s.documents, fileId)
	}
}

func (s *Store) calculateDiscUtilization() (total int64) {
	for _, doc := range s.documents {
		fileInfo, err := os.Stat(doc.GetPath())
		if err == nil {
			total += fileInfo.Size()
		}
	}
	return total
}

// Global Store
var s = newStore()

// Used to add a single Store to a Gin context
// Then, this single store can be accessed globally
// inside of the different Gin HTTP handles
func AddToGinContext(c *gin.Context) {
	c.Set("store", s)
	c.Next()
}
