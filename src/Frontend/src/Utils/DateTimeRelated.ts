import moment from "moment";

const DATETIME_FORMAT = "YYYY-MM-DD HH:mm:ss";

const currentDateTimeString = () => {
  const dt = new Date();
  return (moment(dt)).format("YYYY-MM-DD HH:mm:ss");
};

export { DATETIME_FORMAT, currentDateTimeString };