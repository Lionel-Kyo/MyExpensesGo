import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  IconButton,
  Box,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpensesApi from "../Apis/ExpensensApi";
import EditDialog from "../Components/EditDialog";
import { Expense } from "../Data/Expense";
import { currentDateTimeString, DATETIME_FORMAT } from "../Utils/DateTimeRelated";

const Main = () => {
  const [expenses, setExpenses] = useState<Map<number, Expense>>(new Map<number, Expense>());
  const [dateTime, setDateTime] = useState(currentDateTimeString());
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
    setDateTime(currentDateTimeString());
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
      dateTime: dateTime,
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
    if (expense === undefined) {
      setDateTime(currentDateTimeString());
    } else {
      setDateTime(expense.dateTime);
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

  const columns: GridColDef[] = [
    { field: "dateTime", headerName: "DateTime", width: 300, editable: false },
    { field: "description", headerName: "Description", width: 250, editable: false },
    { field: "amount", headerName: "Amount", width: 250, editable: false },
    {
      field: "actions",
      type: "actions",
      headerName: "Edit / Delete",
      width: 150,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <IconButton
          color="primary"
          onClick={() => handleEdit(id.valueOf() as number)}
        >
          <EditIcon />
        </IconButton>,
        <IconButton
          color="error"
          onClick={() => handleDelete(id.valueOf() as number)}
        >
          <DeleteIcon/>
        </IconButton>
        ];
      },
    },
  ];

  const rows = Array.from(expenses.entries()).map((expense) => ({
    id: expense[0],
    dateTime: expense[1].dateTime,
    description: expense[1].description,
    amount: `$${expense[1].amount.toFixed(2)}`,
  }));

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
      
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
      />

      <EditDialog 
        open={open}
        isNew={editingId === null}
        dateTime={dateTime}
        description={description}
        amount={amount}
        onDateTimeChange={value => setDateTime(value)}
        onDescriptionChange={value => setDescription(value)}
        onAmountChange={value => setAmount(value)}
        onClose={handleCloseDialog}
        onSumbit={handleSubmit}
      />
      
    </Container>
  );
};

export default Main;
