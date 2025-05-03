package main

import (
	"encoding/json"
	"errors"
	"log"
	"os"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"

	"github.com/shopspring/decimal"
)

func main() {
	decimal.MarshalJSONWithoutQuotes = true

	if _, err := os.Stat(expensesPath); errors.Is(err, os.ErrNotExist) {
		expenses.Value = make(map[uint64]Expense)
		err := expenses.save()
		if err != nil {
			log.Fatal(err)
			return
		}
	} else {
		data, err := os.ReadFile(expensesPath)
		if err != nil {
			log.Fatal(err)
			return
		}

		err = json.Unmarshal(data, &expenses.Value)
		if err != nil {
			log.Fatal(err)
			return
		}
		if data == nil {
			log.Fatal("data inside expenses json is nil")
			return
		}
		for id, _ := range expenses.Value {
			if id > expenses.LastestId {
				expenses.LastestId = id
			}
		}
	}

	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "https://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		AllowOriginFunc: func(origin string) bool {
			return strings.HasPrefix(origin, "https://localhost") || strings.HasPrefix(origin, "http://localhost")
		},
		MaxAge: 24 * time.Hour,
	}))

	router.SetTrustedProxies([]string{"127.0.0.1"})

	if _, err := os.Stat("./Web"); os.IsNotExist(err) {
		log.Println("./Web not found, cannot serve frontend.")
	} else {
		router.Use(static.Serve("/", static.LocalFile("./Web", false)))

		router.NoRoute(func(c *gin.Context) {
			c.File("./Web/index.html")
		})
	}

	api := router.Group("/api")
	api.GET("/expenses", getExpenses)
	api.POST("/expenses", insertExpense)
	api.PUT("/expenses/:id", updateExpense)
	api.DELETE("/expenses/:id", removeExpense)

	router.Run(":8080")
}
