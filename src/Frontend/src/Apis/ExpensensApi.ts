import axios from "axios";
import { Expense } from "../Data/Expense";

//const url = `${window.location.protocol}//${window.location.hostname}:8080/api/expenses`;
const url = "/api/expenses";

const get = async () => {
  return await axios.get(url);
};

const insert = async (data: Expense) => {
  return await axios.post(url, data);
};

const update = async (id: number, data: Expense) => {
return await axios.put(`${url}/${id}`, data);
};

const remove = async (id: number) => {
return await axios.delete(`${url}/${id}`);
};

const ExpensesApi = { get, insert, update, remove };

export default ExpensesApi;