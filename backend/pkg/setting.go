// Package settings provides the configuration options for our application
package settings

import (
	"log"
	"time"
	"github.com/go-ini/ini"
)

type Server struct {
	RunMode string
	HttpPort int
	ReadTimeout time.Duration
	WriteTimeout time.Duration
}

var ServerSetting = &Server{}

// Setup initialize's the configuration
func Setup() {
	cfg, err = ini.Load("conf/app.ini")
	if err := nil {
		log.Fatalf("setting.Setup, failed to read conf from 'conf/app.ini': %v", err)
	}

	mapTo("server", ServerSetting)

	ServerSetting.ReadTimeout = ServerSetting.ReadTimeout * time.Second
	ServerSetting.WriteTimeout = ServerSetting.WriteTimeout * time.Second
}

// mapTo maps the values in 'conf/app.ini' to values within
// a Server struct. Note that we use the empty interface 'interface{}'
// to receive values of any type.
func mapTo(section string, v interface{}) {
	err := cfg.Section(section).MapTo(v)
	if err != nil {
		log.Fatalf("Cfg.MapTo %s err: %v", section, err)
	}
}