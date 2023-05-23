import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  AppRegistry,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { currencyCodes } from "../services/Symbols";
import { PacmanIndicator, BarIndicator } from "react-native-indicators";
import { currencyConversion } from "../services/Convert";
import { getExchangeRate } from "../services/ExchangeRate";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ReactNativeFusionCharts from "react-native-fusioncharts";
import { FontAwesome } from "@expo/vector-icons";
import * as Animate from "react-native-animatable";
// import { LineChart, Grid, XAxis } from "react-native-svg-charts";

const MainScreen = () => {
  const [selectedCurrencyFrom, setSelectedCurrencyFrom] = useState("From");
  const [selectedCurrencyTo, setSelectedCurrencyTo] = useState("To");
  const [initialAmount, setInitialAmount] = useState("");
  const [finalAmount, setFinalAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [currency_Pairs, setCurrencyPairs] = useState([]);
  const [responseObject, setResponseObject] = useState([]);
  const [showChart, setShowChart] = useState(false);
  const [pressed, setPressed] = useState(false);
  let dataArray=[];

  // Demo Data for charts
  // const exchangeRateData = [
  //   { label: "2023-05-01", value: 0.75 },
  //   { label: "2023-05-02", value: 0.76 },
  //   { label: "2023-05-03", value: 0.74 },
  //   { label: "2023-05-04", value: 0.6 },
  //   { label: "2023-05-07", value: 0.5 },
  //   { label: "2023-05-08", value: 0.24 },
  // ];
  const exchangeRateData = [
    {
      "2023-05-15": 0.61531,
      "2023-05-16": 0.61312,
      "2023-05-17": 0.61395,
      "2023-05-18": 0.61383,
      "2023-05-19": 0.6171,
      "2023-05-20": 0.6153,
      "2023-05-21": 0.6153,
      "2023-05-22": 0.61505,
    },
  ];

  const handleCurrencyChangeFrom = (value) => {
    setSelectedCurrencyFrom(value);
    // console.log(value);
  };
  const handleCurrencyChangeTo = (value) => {
    setSelectedCurrencyTo(value);
    // console.log(value);
  };

  const handleConvert = async () => {
    try {
      if (
        selectedCurrencyFrom === "From" ||
        selectedCurrencyTo === "To" ||
        initialAmount === ""
      ) {
        Alert.alert("Input Required", "All Fields Are Required");
        return false;
      }
      setPressed(true);

      setLoading(true);
      setShowChart(false);
      // Currency Conversion
      const response = await currencyConversion(
        selectedCurrencyFrom,
        selectedCurrencyTo,
        initialAmount
      );
      setFinalAmount(`${response.new_amount}`);

      // Store the currency pair
      const currencyPair = {
        currencyFrom: `${selectedCurrencyFrom}`,
        currencyTo: `${selectedCurrencyTo}`,
        oldAmount: `${response.old_amount}`,
        newAmount: `${response.new_amount}`,
        count: 1,
        liked: false,
      };

      const storedPairs = await AsyncStorage.getItem("currencyPairs");
      let currencyPairs = storedPairs ? JSON.parse(storedPairs) : {};
      const pairKey = `${selectedCurrencyFrom}_${selectedCurrencyTo}`;

      if (!currencyPairs[pairKey]) {
        currencyPairs[pairKey] = currencyPair;

        await AsyncStorage.setItem(
          "currencyPairs",
          JSON.stringify(currencyPairs)
        );
        // console.log("Currency pair stored successfully");
      }
      if (currencyPairs[pairKey]) {
        currencyPairs[pairKey].oldAmount = response.old_amount;
        currencyPairs[pairKey].newAmount = response.new_amount;
        currencyPairs[pairKey].count++;
        await AsyncStorage.setItem(
          "currencyPairs",
          JSON.stringify(currencyPairs)
        );
      }
      // console.log(response);

      // Getting Exchange rates//////////////////////////////////////////////////////////////////
      const exchangeRateResponse = await getExchangeRate(
        selectedCurrencyFrom,
        selectedCurrencyTo
      );
  

      const dynamicKey = Object.keys(exchangeRateResponse.results)[0]; // Get the dynamic key
      const convertedData = Object.keys(
        exchangeRateResponse.results[dynamicKey]
      ).map((date) => ({
        label: date,
        value: exchangeRateResponse.results[dynamicKey][date],
      }));

      setResponseObject(convertedData);
      setShowChart(true);
      setLoading(false);
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  // Chart Configuration
  const chartConfig = {
    type: "line",
    width: "100%",
    height: "300",
    dataFormat: "json",
    dataSource: {
      chart: {
        caption: "Exchange Rate Chart",
        subCaption: `${selectedCurrencyFrom} per ${selectedCurrencyTo}`,
        xAxisName: "Date",
        yAxisName: "Rate",
        numberSuffix: "",
        theme: "Candy",
        // exportEnabled: 1,
      },
      data: responseObject,
    },
  };

  // Handle Favourites////////////////////////////////////////////////////////////////
  const handleFavourites = async () => {
    if (
      selectedCurrencyFrom === "From" ||
      selectedCurrencyTo === "To" ||
      initialAmount === "" ||
      finalAmount === ""
    ) {
      Alert.alert("Input Required", "All Fields Are Required");
      if (pressed === false) {
        Alert.alert(
          "Convert",
          "Please convert the currency first before adding to favourites"
        );
      }
    } else {
      const storedPairs = await AsyncStorage.getItem("currencyPairs");
      let currencyPairs = storedPairs ? JSON.parse(storedPairs) : {};

      const pairKey = `${selectedCurrencyFrom}_${selectedCurrencyTo}`;

      if (currencyPairs[pairKey]?.liked === false) {
        currencyPairs[pairKey].liked = true;
        await AsyncStorage.setItem(
          "currencyPairs",
          JSON.stringify(currencyPairs)
        );
        Alert.alert("Success", "Pair added to favourites");
        console.log(currencyPairs);
      } else {
        Alert.alert("Info", "Pair already added ");
      }
    }
  };

  // Handle Clear Function
  const handleClear = async () => {
    setInitialAmount("");
    setFinalAmount("");
    setShowChart(false);
    console.log(responseObject);
    // await AsyncStorage.clear();
    // console.log(currency_Pairs);
  };

  // Fetching currency pairs from async storage//////////////////////////////////////
  const fetchCurrencyPairs = async () => {
    try {
      const storedPairs = await AsyncStorage.getItem("currencyPairs");
      if (storedPairs) {
        const parsedPairs = JSON.parse(storedPairs);
        setCurrencyPairs(parsedPairs);
      } else {
        console.log("No currency pairs found");
      }
    } catch (error) {
      console.error("Error fetching currency pairs:", error);
    }
  };

  //Handling History //////////////////////////////////////////////////////////////
  const fetchHistory = async () => {
    const storedPairs = await AsyncStorage.getItem("currencyPairs");
    if(storedPairs){

      let currencyPairs = storedPairs ? JSON.parse(storedPairs) : {};
      const firstObject = Object.values(currencyPairs)?.reverse()[0];
      setSelectedCurrencyFrom(firstObject?.currencyFrom);
      setInitialAmount(firstObject?.oldAmount);
      setFinalAmount(firstObject?.newAmount);
      setSelectedCurrencyTo(firstObject?.currencyTo);
    }
    else{
      Alert.alert("Info","No Currency Pair found")
    }
  };

  useEffect(() => {
    // fetching currency pairs
    fetchCurrencyPairs();
  }, [fetchCurrencyPairs]);

  // Recent searches handling///////////////////////////////////////////////////////
  const recentSearchHandle = (value) => {
    const currency_Array = value.split("_");
    setSelectedCurrencyFrom(currency_Array[0]);
    setSelectedCurrencyTo(currency_Array[1]);
    //  console.log(value);
  };
  const labels = exchangeRateData.map((data) => data.label);
  const values = exchangeRateData.map((data) => data.value);

  const data = [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80];

  const contentInset = { top: 20, bottom: 20 };
  return (
    <SafeAreaView className="flex-1 relative bg-[#2f2f2f]">
      <View className="w-full flex ">
        {/* welcome Section ///////////////////////////////////////////////////////////////////////*/}
        <View className="w-full flex-row space-x-2 px-4  items-center flex-wrap">
          <Animate.View
            animation="fadeInLeft"
            duration={1000}
            className="w-16 h-16 bg-[#fab60f] justify-center items-center  mt-4 rounded-full"
          >
            <Text className="text-4xl font-[OrbitronBold]">W</Text>
          </Animate.View>
          <Animate.Text
            animation="fadeInRight"
            duration={1000}
            className="text-[#f6f6f6] text-2xl font-[OrbitronBold] mt-4"
          >
            elcome to Currency X
          </Animate.Text>
          <Animate.Text
            className="text-xl text-[#f6f6f6] font-[MonstratLight] "
            animation="fadeInUp"
          >
            Easily convert currencies and stay updated with exchange rates.
          </Animate.Text>
        </View>

        {/* Input Section ///////////////////////////////////////////////////////////////////////*/}
        <View className="flex  mx-4">
          <View className="flex-row justify-between">
            {/* Picker 1 */}
            <Animate.View
              animation="fadeInLeft"
              duration={1000}
              className="mt-3 w-[174px] bg-[#ffcb74] rounded-full "
            >
              <Picker
                selectedValue={selectedCurrencyFrom}
                onValueChange={handleCurrencyChangeFrom}
              >
                <Picker.Item label="From" value={selectedCurrencyFrom} />
                {Object.keys(currencyCodes).map((currencyCode) => (
                  <Picker.Item
                    key={currencyCode}
                    label={`${currencyCodes[currencyCode].currencyCode} ${currencyCodes[currencyCode].countryName}`}
                    value={currencyCodes[currencyCode].currencyCode}
                  />
                ))}
              </Picker>
            </Animate.View>
            {/* Picker 2 */}
            <Animate.View
              className="mt-3 w-[174px]  bg-[#ffcb74] rounded-full"
              animation="fadeInRight"
              duration={1000}
            >
              <Picker
                selectedValue={selectedCurrencyTo}
                onValueChange={handleCurrencyChangeTo}
              >
                <Picker.Item label="To" value={selectedCurrencyTo} />
                {Object.keys(currencyCodes).map((currencyCode) => (
                  <Picker.Item
                    key={currencyCode}
                    label={`${currencyCodes[currencyCode].currencyCode} ${currencyCodes[currencyCode].countryName}`}
                    value={currencyCodes[currencyCode].currencyCode}
                  />
                ))}
              </Picker>
            </Animate.View>
          </View>
          <Animate.View animation="fadeInUp" className="flex-col">
            <TextInput
              animation="fadeInLeft"
              duration={1000}
              placeholder={`${selectedCurrencyFrom}`}
              onChangeText={(text) => {
                setInitialAmount(text);
              }}
              className="bg-[#f6f6f6] ring-2  text-black text-lg font-bold py-2 px-3 mt-3 rounded-full"
              keyboardType="numeric"
              value={initialAmount.toString()}
            />
            <TextInput
              placeholder={`${selectedCurrencyTo}`}
              className="bg-[#f6f6f6] ring-2  text-black text-lg font-bold py-2 px-3 mt-3 rounded-full"
              keyboardType="numeric"
              value={finalAmount.toString()}
              editable={false}
            />
          </Animate.View>
          <View></View>
          {/* Button section */}
          <View className="w-full flex-row items-center justify-between space-x-2">
            {loading ? (
              <View className="w-[174px] mt-4 justify-center items-center  bg-[#fab60f] rounded-full">
                <PacmanIndicator color="#2f2f2f" size={40} />
              </View>
            ) : (
              <View>
                <TouchableOpacity
                  onPress={handleConvert}
                  className="w-[174px] mt-3 justify-center  items-center py-2 bg-[#fab60f] rounded-full"
                >
                  <Text className="text-center text-2xl  font-[OrbitronMedium]">
                    Convert
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {/*Liked Button  */}
            <Animate.View animation="fadeInRight" duration={500} delay={800}>
              <TouchableOpacity
                onPress={handleFavourites}
                className="w-[50px] justify-center items-center mt-3 py-3   rounded-full bg-[#fab60f]"
              >
                <FontAwesome name="heart" size={24} color="black" />
              </TouchableOpacity>
            </Animate.View>

            {/*History*/}
            <Animate.View animation="fadeInRight" duration={500} delay={500}>
              <TouchableOpacity
                onPress={fetchHistory}
                className="w-[50px] justify-center items-center mt-3 py-3 rounded-full bg-[#fab60f]"
              >
                <FontAwesome name="history" size={24} color="black" />
              </TouchableOpacity>
            </Animate.View>

            {/* Clear Button */}
            <Animate.View animation="fadeInRight" duration={500}>
              <TouchableOpacity
                onPress={handleClear}
                className="w-[50px] justify-center items-center mt-3 py-3 rounded-full bg-[#fab60f]"
              >
                <FontAwesome name="trash" size={24} color="black" />
              </TouchableOpacity>
            </Animate.View>
          </View>

          <View className="w-full flex-row justify-between flex-wrap">
            {/* Recent Searches Picker///////////////////////////////////////////////////////////// */}
            <Animate.View
              animation="fadeInLeft"
              duration={500}
              delay={500}
              className="mt-3 w-[174px] bg-[#ffcb74] rounded-full"
            >
              <Picker selectedValue={null} onValueChange={recentSearchHandle}>
                <Picker.Item label="Recent" value="" />
                {Object.keys(currency_Pairs)
                  .reverse()
                  .map((pair) => (
                    <Picker.Item
                      key={pair}
                      label={`${pair}`}
                      value={`${pair}`}
                    />
                  ))}
              </Picker>
            </Animate.View>
            {/* Liked Currency Pair Picker///////////////////////////////////////////////////////////// */}
            <Animate.View
              duration={500}
              delay={500}
              animation="fadeInRight"
              className="mt-3 w-[174px] bg-[#ffcb74] rounded-full"
            >
              <Picker selectedValue={null} onValueChange={recentSearchHandle}>
                <Picker.Item label="Liked" value="" />
                {Object.keys(currency_Pairs)
                  .reverse()
                  .filter((pair) => currency_Pairs[pair]?.liked === true)
                  .map((pair) => (
                    <Picker.Item
                      key={pair}
                      label={`${pair}`}
                      // label={`${currency_Pairs[pair].currencyFrom}->${currency_Pairs[pair].currencyTo}`}
                      value={`${pair}`}
                      // value={`${currency_Pairs[pair].currencyFrom}-${currency_Pairs[pair].currencyTo}`}
                    />
                  ))}
              </Picker>
            </Animate.View>
            {/* Most Searched Currency Pairs Picker/////////////////////////////////////////////////*/}
            <Animate.View
              animation="fadeInUp"
              duration={500}
              delay={500}
              className="mt-3 w-full bg-[#ffcb74] rounded-full"
            >
              <Picker selectedValue={null} onValueChange={recentSearchHandle}>
                <Picker.Item label="Most Searched" value="" />
                {Object.keys(currency_Pairs)
                  .reverse()
                  .filter((pair) => currency_Pairs[pair]?.count > 3)
                  .map((pair) => (
                    <Picker.Item
                      key={pair}
                      label={`${pair}`}
                      value={`${pair}`}
                    />
                  ))}
              </Picker>
            </Animate.View>
          </View>
        </View>

        {/* Exchange rate chart section */}
        
        {loading ? (
          <View className="w-full mt-12 justify-center items-center ">
            <BarIndicator color="#fab60f" size={60} />
          </View>
        ) : showChart ? (
          <View className=" w-full flex px-5 rounded-lg mt-4 ">
            {<ReactNativeFusionCharts chartConfig={chartConfig} /> ? (
              <ReactNativeFusionCharts chartConfig={chartConfig} />
            ) : (
              <BarIndicator color="#fab60f" size={60} />
            )}
          </View>
        ) : (
          <></>
        )}

      </View>
    </SafeAreaView>
  );
};

export default MainScreen;
AppRegistry.registerComponent("ReactNativeFusionCharts", () => MainScreen);
