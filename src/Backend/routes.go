package main

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func getExpenses(c *gin.Context) {
	c.JSON(http.StatusOK, expenses.Value)
}

func insertExpense(c *gin.Context) {
	var expense Expense

	if err := c.ShouldBindJSON(&expense); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	expenses.IdMutex.Lock()
	defer expenses.IdMutex.Unlock()
	expenses.LastestId += 1
	expenses.Value[expenses.LastestId] = expense

	err := saveExpenses()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, expense)
}

func updateExpense(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": err.Error()})
		return
	}

	_, ok := expenses.Value[id]

	if !ok {
		c.JSON(http.StatusNotFound, gin.H{"message": "Expense not found"})
		return
	}

	var expense Expense
	if err := c.ShouldBindJSON(&expense); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	expenses.Value[id] = expense
	err = saveExpenses()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, expense)
}

func removeExpense(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": err.Error()})
		return
	}

	_, ok := expenses.Value[id]

	if !ok {
		c.JSON(http.StatusNotFound, gin.H{"message": "Expense not found"})
		return
	}

	delete(expenses.Value, id)
	err = saveExpenses()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Expense removed"})
}
