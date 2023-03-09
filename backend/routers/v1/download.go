// Package v1 contains the V1 HTTP endpoints for our application
package v1

import (
	"net/http"
	"log"
	"github.com/gin-gonic/gin"	
)

func DownloadFile(c *gin.Context) {
	fileName := c.FormValue("fileName")

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "tmp/" + fileName)
	})

	err := http.ListenAndServe(":8080", nil)

    if err != nil {
        log.Fatal("ListenAndServe: ", err)
    }
}

/*
// file, err := c.fromFile(c.Keys.Get(fileName))
	// file, err := c.fromFile("file")

	// if err != nil {
	// 	c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
	// 		"message": "No file found",
	// 	})
	// 	return
	// }

	// if err := c.File("file"); err != nil {
	// 	c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
	// 		"message": "Unable to save the file",
	// 	})
	// 	return
	// }

	// c.JSON(StatusOK, gin.H {
	// 	"message": "File has been successfully written to body stream",
	// })
*/