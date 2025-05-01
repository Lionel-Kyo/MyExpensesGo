package main

import (
	"encoding/json"
	"os"
	"sync"

	"github.com/shopspring/decimal"
)

const expensesPath = "./Expenses.json"

var expenses Expenses

type Expense struct {
	Description string          `json:"description"`
	Amount      decimal.Decimal `json:"amount"`
}

type Expenses struct {
	Value     map[uint64]Expense
	LastestId uint64
	IdMutex   sync.Mutex
	SaveMutex sync.Mutex
}

func saveExpenses() error {
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
