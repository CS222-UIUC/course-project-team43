// Stores information about the state of the server
// 1) What files are currently active
// 2) The active download endpoints
// 3) Downloads in progress

package services

import (
	"strings"
	"sync"
	"time"
	"log"

	"github.com/gin-gonic/gin"
)

type Store struct {
	mu sync.Mutex
	links []string
}

func (s *Store) DownloadAndStore(link string) {
	// Simulating downloading 
	time.Sleep(8 * time.Second)

	// Aquire the mutex to avoid a race condition
	// when adding into 'links'
	s.mu.Lock()
	defer s.mu.Unlock()

	// Add link to the global links
	log.Printf("Saving " + link)
	s.links = append(s.links, link)
	log.Printf("Currently in Store: " + strings.Join(s.links, " "))
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