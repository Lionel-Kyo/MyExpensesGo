import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExpensesApi from "../Apis/ExpensensApi";
import EditDialog from "../Components/EditDialog";
import { Expense } from "../Data/Expense";

const Main = () => {
  const [expenses, setExpenses] = useState<Map<number, Expense>>(new Map<number, Expense>());
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await ExpensesApi.get();
      setExpenses(new Map<number, Expense>(Object.entries(response.data) as Iterable<[number, Expense]>));
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const handleOpenDialog = () => setOpen(true);
  const handleCloseDialog = () => {
    setOpen(false);
    setDescription("");
    setAmount("");
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (description.length <= 0 || isNaN(parseFloat(amount))) {
      alert("Please enter valid description and amount");
      return;
    }

    const newExpense: Expense = { 
      description: description, 
      amount: parseFloat(amount) 
    };

    try {
      if (editingId === null) {
        await ExpensesApi.insert(newExpense);
      } else {
        await ExpensesApi.update(editingId, newExpense);
      }
      fetchExpenses();
      handleCloseDialog();
    } catch (error) {
      console.error("Error inserting/updating expense:", error);
    }
  };

  const handleEdit = (id: number) => {
    const expense = expenses.get(id);
    if (expense !== undefined) {
      setDescription(expense.description);
      setAmount(expense.amount.toString());
      setEditingId(id);
      handleOpenDialog();
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await ExpensesApi.remove(id);
      fetchExpenses();
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-start", width: "100%" }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ mb: 4 }}
          onClick={handleOpenDialog}
        >
          Add Expense
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from(expenses.entries()).map((expense) => (
              <TableRow key={expense[0]}>
                <TableCell>{expense[1].description}</TableCell>
                <TableCell>${expense[1].amount.toFixed(2)}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(expense[0])}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(expense[0])}
                  >
                    <DeleteIcon/>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <EditDialog 
        open={open}
        isNew={editingId === null}
        description={description}
        amount={amount}
        onDescriptionChange={value => setDescription(value)}
        onAmountChange={value => setAmount(value)}
        onClose={handleCloseDialog}
        onSumbit={handleSubmit}
      />
      
    </Container>
  );
};

export default Main;
