package services

import (
	"log"
	"sync"

	"github.com/gin-gonic/gin"

	"QuickShare/models"
)

// Store tracks information about the files that are currently
// downloaded onto the server.
type Store struct {
	mu        sync.Mutex
	documents []models.Document
}

func (s *Store) AddToStore(doc models.Document) {
	// Aquire the mutex to avoid a race condition
	// when adding into 'links'
	s.mu.Lock()
	defer s.mu.Unlock()

	// Add link to the global links
	s.documents = append(s.documents, doc)
	s.PrintDocuments()
}

func (s *Store) PrintDocuments() {
	log.Printf("Currently in Store: ")
	for _, doc := range s.documents {
		log.Printf("%v", doc)
	}
}

func (s *Store) RemoveFile(link string) {
	// TODO: Implement the abililty to remove a file from the FS
}

// Global Store
var s = Store{}

// Used to add a single Store to a Gin context
// Then, this single store can be accessed globally
// inside of the different Gin HTTP handles
func AddToGinContext(c *gin.Context) {
	c.Set("store", &s)
	c.Next()
}
