package routers

import (
	"QuickShare/pkg/setting"
	v1 "QuickShare/routers/v1"
	"bytes"
	"encoding/json"
	"io"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strconv"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func init() {
	setting.Setup("../conf/app.ini")
}

func CreateMultiPartFormFile(t *testing.T, file io.Reader, filename string, contents []byte) (io.Reader, string) {
	var b bytes.Buffer
	var fw io.Writer
	w := multipart.NewWriter(&b)
	err := w.WriteField("expiration", strconv.FormatInt(time.Now().Add(time.Minute).UnixMilli(), 10))
	if err != nil {
		t.Fatalf("Failed to write expiration to multipart: %v", err)
	}
	if fw, err = w.CreateFormFile("file", "test.txt"); err != nil {
		t.Fatalf("Failed to create file in multipart: %v", err)
	}
	if _, err := fw.Write(contents); err != nil {
		t.Fatalf("Failed to write contents to writer: %v", err)
	}
	w.Close()
	return &b, w.FormDataContentType()
}

func TestApp(t *testing.T) {
	router := InitRouter()
	contents := []byte("hello world")

	content, contentType := CreateMultiPartFormFile(t, nil, "/arbitrary/path/test.txt", contents)

	rec := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/upload", content)
	req.Header.Set("Content-Type", contentType)
	router.ServeHTTP(rec, req)

	assert.Equal(t, http.StatusOK, rec.Code)
	var res v1.UploadResponse
	err := json.Unmarshal(rec.Body.Bytes(), &res)
	assert.NoError(t, err, "Download response should deserialize")
	assert.NotEqual(t, "", res.FileId, "Should have non-empty file ID")
	assert.True(t, time.UnixMilli(res.Expiration).After(time.Now()), "Expiration should be in future")

	fp := filepath.Join(setting.ServerSetting.DownloadPath, res.FileId+".txt")
	actual, err := os.ReadFile(fp)
	assert.NoError(t, err, "File should exist on system")
	assert.Equal(t, contents, actual, "Contents on system should match")

	fileReq := v1.FileRequest{FileId: res.FileId}
	var fileReqBody []byte
	if fileReqBody, err = json.Marshal(fileReq); err != nil {
		t.Fatalf("Failed to serialize file request: %v", err)
	}

	rec = httptest.NewRecorder()
	req, _ = http.NewRequest("POST", "/download", bytes.NewBuffer(fileReqBody))
	router.ServeHTTP(rec, req)

	assert.Equal(t, http.StatusOK, rec.Code)
	assert.Equal(t, contents, rec.Body.Bytes(), "File contents should match")
}

func TestMissingFileUpload(t *testing.T) {
	router := InitRouter()

	rec := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/upload", nil)
	router.ServeHTTP(rec, req)

	assert.Equal(t, http.StatusBadRequest, rec.Code, "Request should fail")
}

func TestFileNameNoExtUpload(t *testing.T) {
	router := InitRouter()

	contents := []byte("hello world")
	content, contentType := CreateMultiPartFormFile(t, nil, "test", contents)

	rec := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/upload", content)
	req.Header.Set("Content-Type", contentType)
	router.ServeHTTP(rec, req)

	assert.Equal(t, http.StatusOK, rec.Code)

	var res v1.UploadResponse
	err := json.Unmarshal(rec.Body.Bytes(), &res)
	assert.NoError(t, err, "Download response should deserialize")
	assert.NotEqual(t, "", res.FileId, "Should have non-empty file ID")

	fileReq := v1.FileRequest{FileId: res.FileId}
	var fileReqBody []byte
	if fileReqBody, err = json.Marshal(fileReq); err != nil {
		t.Fatalf("Failed to serialize file request: %v", err)
	}

	rec = httptest.NewRecorder()
	req, _ = http.NewRequest("POST", "/serve", bytes.NewBuffer(fileReqBody))
	router.ServeHTTP(rec, req)

	assert.Equal(t, http.StatusOK, rec.Code)
	assert.Equal(t, contents, rec.Body.Bytes(), "File contents should match")
}
