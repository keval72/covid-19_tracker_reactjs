import React, { useState, useEffect } from "react";
import { MenuItem, FormControl, Select, Card, CardContent } from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import "./App.css";
import Table from "./Table";
import { sortData, prettyPrintStat } from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";
import coronaImage from './images/image.png';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(["worldwide"]);
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat:23.83464, lng:80.2897 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
 
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then((response) => response.json())
    .then((data) => {
      setCountryInfo(data);
    });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country, //Unitated States
            value: country.countryInfo.iso2, // US
          }));
           
          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    

    const url = 
     countryCode === "worldwide"
      ? "https://disease.sh/v3/covid-19/all"
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
 
    await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      setCountry(countryCode);
      setCountryInfo(data);   
      
      countryCode === "worldwide"
      ? setMapCenter([23.83464, 80.2897])
      : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      countryCode === "worldwide" ? setMapZoom(3) : setMapZoom(4);
     
    }); 
  };
  
  //  function onCountryChange(event){
  //    const countryCode = event.target.value;
  //    setCountry(countryCode);
  //  }

  return (
    <div className="app">
      <div className="app__left">
        <div className="app_header">
          <img className="app__image" src={coronaImage} alt="COVID-19" />
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox 
            isBlue
            active={casesType === "cases"}
            onClick = {(e) => setCasesType('cases')}
            title="New Cases:" 
            text="Cases:"
            cases={prettyPrintStat(countryInfo.todayCases)} 
            total={prettyPrintStat(countryInfo.cases)} 
          />
          <InfoBox 
            isGreen
            active={casesType === "recovered"}
            onClick = {(e) => setCasesType('recovered')}
            title="New Recovered:" 
            text="Recovered:"
            cases={prettyPrintStat(countryInfo.todayRecovered)} 
            total={prettyPrintStat(countryInfo.recovered)} 
          />
          <InfoBox 
            isRed
            active={casesType === "deaths"}
            onClick = {(e) => setCasesType('deaths')}
            title="New Deaths:" 
            text="Deaths:"
            cases={prettyPrintStat(countryInfo.todayDeaths)} 
            total={prettyPrintStat(countryInfo.deaths)} 
          />
        </div>

       
        <Map 
        casesType={casesType}
        countries = {mapCountries}
        center = {mapCenter}
        zoom = {mapZoom}        
        />
      </div>
      <Card className="app__right">

        <CardContent>
          <h3>Live cases by country</h3>
          <Table countries={tableData} />
          <h3 className="app__graphTitle">Worldwide new {casesType}</h3> 
          <LineGraph className="app__graph" casesType={casesType} />
        </CardContent>      
      </Card>  
    </div>
  );
}

export default App;
