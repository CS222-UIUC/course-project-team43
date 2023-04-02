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

func TestApp(t *testing.T) {
	router := InitRouter()
	contents := []byte("hello world")

	var b bytes.Buffer
	var fw io.Writer
	var err error
	w := multipart.NewWriter(&b)
	w.WriteField("expiration", strconv.FormatInt(time.Now().Add(time.Minute).UnixMilli(), 10))
	if fw, err = w.CreateFormFile("file", "test.txt"); err != nil {
		t.Fatalf("Failed to create file in multipart: %v", err)
	}
	if _, err := fw.Write(contents); err != nil {
		t.Fatalf("Failed to write contents to writer: %v", err)
	}
	w.Close()

	rec := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/upload", &b)
	req.Header.Set("Content-Type", w.FormDataContentType())
	router.ServeHTTP(rec, req)

	assert.Equal(t, http.StatusOK, rec.Code)
	var res v1.UploadResponse
	err = json.Unmarshal(rec.Body.Bytes(), &res)
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
