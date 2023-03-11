// Package v1 contains the V1 HTTP endpoints for our application.
package v1

import(
	"net/http"
	"github.com/gin-gonic/gin"
)

func UploadFile(c *gin.Context) {
	c.FormValue("fileName")
	// According to the wiki, this line should get a fileName from the front end
	// that has been posted using FormData.

	// services.
}


/*
passing a json to gon framework
*/