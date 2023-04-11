package services

import (
	"os"
	"io"
	"io/ioutil"
	"compress/gzip"
	"mime/multipart"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"

	"QuickShare/models"
)

// CompressAndWrite takes HTTP form data, creates a new 
// file on the disc with the given path, and writes the file
// after compression with GZIP 
func CompressAndWrite(header *multipart.FileHeader, outputPath string) error {
	zap.S().Info("Compressing")

	inputFile, err := header.Open()
	if err != nil {
		return err
	}
	defer inputFile.Close()

	// Create the output file
	outputFile, err := os.Create(outputPath)
	if err != nil {
		return err
	}
	defer outputFile.Close()

	// Create a Gzip writer
	gzipWriter := gzip.NewWriter(outputFile)
	defer gzipWriter.Close()

	// Copy the input file to the Gzip writer
	_, err = io.Copy(gzipWriter, inputFile)
	if err != nil {
		return err
	}

	return nil
}

func DecompressAndServe(c *gin.Context, document *models.Document) {
	zap.S().Info("Decompressing")

	// Open the Gzip file
	compressed, err := os.Open(document.GetPath())
	if err != nil {
		return
	}
	defer compressed.Close()

	// Create a Gzip reader
	reader, err := gzip.NewReader(compressed)
	if err != nil {
		return
	}
	defer reader.Close()

	// Create a temporary file for the decompressed data
	tempFile, err := ioutil.TempFile("", "")
	if err != nil {
		return
	}
	defer tempFile.Close()

	// Write the decompressed data to the temporary file
	_, err = io.Copy(tempFile, reader)
	if err != nil {
		return
	}

	// Reset the file offset to the beginning of the file
	_, err = tempFile.Seek(0, 0)
	if err != nil {
		return
	}

	c.File(tempFile.Name())
}