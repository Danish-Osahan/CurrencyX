import axios from "axios";

const options = { headers: { accept: "application/json" } };

export const getExchangeRate = async (from, to) => {
  const currentDate = new Date();
  const startDate = new Date(); // Create a new date object for the start date
  startDate.setDate(currentDate.getDate() - 7); // Subtract 10 days from the current date

  const formattedStartDate = startDate.toISOString().split("T")[0]; // Format the start date as YYYY-MM-DD
  const formattedEndDate = currentDate.toISOString().split("T")[0]; // Format the end date as YYYY-MM-DD

  const apiUrl = `https://api.fastforex.io/time-series?from=${from}&to=${to}&start=${formattedStartDate}&end=${formattedEndDate}&interval=P1D&api_key=c7345add00-b39d6c662b-ruwnrb`;

  try {
    const response = await axios.get(
      //   `https://api.fastforex.io/time-series?from=${from}&to=${to}&start=2023-05-10&end=2023-05-19&interval=P1D&api_key=c7345add00-b39d6c662b-ruwnrb`,
      apiUrl,
      options
    );
    return response.data;
  } catch (error) {
    return error;
  }
};
