import axios from "axios";

export const currencyConversion=async(haveCurrency, wantCurrency, amount)=>{
    const options = {
        method: 'GET',
        url: 'https://currency-converter-by-api-ninjas.p.rapidapi.com/v1/convertcurrency',
        params: {
          have: haveCurrency,
          want: wantCurrency,
          amount: amount.toString()
        },
        headers: {
          'X-RapidAPI-Key': 'a8ecddad32mshcec8b0122360b28p1ed558jsn771c1e7b54da',
          'X-RapidAPI-Host': 'currency-converter-by-api-ninjas.p.rapidapi.com'
        }
      };

      try {
        const response=await axios.request(options);
        return response.data;
      } catch (error) {
        return error;
      }
}