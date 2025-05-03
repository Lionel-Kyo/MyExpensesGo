import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { currentDateTimeString, DATETIME_FORMAT } from "../Utils/DateTimeRelated";

type EditDialogParams = {
  open: boolean;
  isNew: boolean;
  dateTime: string;
  description: string;
  amount: string;
  onDateTimeChange: (dateTime: string) => void;
  onDescriptionChange: (description: string) => void;
  onAmountChange: (amount: string) => void;
  onClose: () => void;
  onSumbit: (e: React.FormEvent) => void;
}

const EditDialog = (params: EditDialogParams) => {
    return (
        <Dialog open={params.open} onClose={params.onClose}>
        <DialogTitle>{params.isNew ? "Add Expense" : "Edit Expense"}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={params.onSumbit}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="DateTime"
                views={["year", "month", "day", "hours", "minutes", "seconds"]}
                ampm={false}
                format={DATETIME_FORMAT}
                value={dayjs(params.dateTime)}
                onChange={(newValue) => params.onDateTimeChange(newValue?.format(DATETIME_FORMAT) ?? currentDateTimeString())}
                sx={{ mt: 2, mb: 2 }}
              />
            </LocalizationProvider>
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