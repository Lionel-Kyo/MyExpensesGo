package main

import (
	"encoding/json"
	"fmt"
	"os"
	"sync"
	"time"

	"github.com/shopspring/decimal"
)

const expensesPath = "./Expenses.json"

var expenses Expenses

type Expense struct {
	DateTime    time.Time       `json:"dateTime"`
	Description string          `json:"description"`
	Amount      decimal.Decimal `json:"amount"`
}

func (e Expense) MarshalJSON() ([]byte, error) {
	type Alias Expense
	return json.Marshal(&struct {
		DateTime string `json:"dateTime"`
		*Alias
	}{
		Alias:    (*Alias)(&e),
		DateTime: e.DateTime.Format("2006-01-02 15:04:05"),
	})
}

func (e *Expense) UnmarshalJSON(data []byte) error {
	type Alias Expense
	aux := &struct {
		DateTime string `json:"dateTime"`
		*Alias
	}{
		Alias: (*Alias)(e),
	}

	if err := json.Unmarshal(data, aux); err != nil {
		return err
	}

	if aux.DateTime != "" {
		parsedTime, err := time.Parse("2006-01-02 15:04:05", aux.DateTime)
		if err != nil {
			return fmt.Errorf("failed to parse created_at: %w", err)
		}
		e.DateTime = parsedTime
	}

	return nil
}

type Expenses struct {
	Value     map[uint64]Expense
	LastestId uint64
	IdMutex   sync.Mutex
	SaveMutex sync.Mutex
}

func (expenses *Expenses) save() error {
	expenses.SaveMutex.Lock()
	defer expenses.SaveMutex.Unlock()
	expensesJson, err := json.Marshal(&expenses.Value)
	if err != nil {
		return err
	}

	err = os.WriteFile(expensesPath, []byte(expensesJson), 0644)
	if err != nil {
		return err
	}
	return nil
}
