import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from "@mui/material";

type EditDialogParams = {
  open: boolean;
  isNew: boolean;
  description: string;
  amount: string;
  onDescriptionChange: (description: string) => void;
  onAmountChange: (amount: string) => void;
  onClose: () => void;
  onSumbit: (e: React.FormEvent) => void;
}

const EditDialog = (params: EditDialogParams) => {
    return (
        <Dialog open={params.open} onClose={params.onClose}>
        <DialogTitle>{params.isNew ? "Add Expense" : "Edit Expense"}</DialogTitle>
        <Box sx={{ m: 1 }} />
        <DialogContent>
          <Box component="form" onSubmit={params.onSumbit}>
            <TextField
              fullWidth
              label="Description"
              value={params.description}
              onChange={(e) => params.onDescriptionChange(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={params.amount}
              onChange={(e) => params.onAmountChange(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={params.onClose} color="primary" variant="contained">
            Cancel
          </Button>
          <Button onClick={params.onSumbit} color="error" variant="contained">
            {params.isNew ? "Add" : "Update"}
          </Button>
        </DialogActions>
      </Dialog>
    )
};

export default EditDialog;