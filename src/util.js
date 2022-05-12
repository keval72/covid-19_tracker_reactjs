import { Circle, Popup } from "react-leaflet"; 
import React from "react";
import numeral from "numeral"; 

const casesTypeColors = {
  cases: {
		hex: "#4169e1",
    multiplier: 100,
  },
  recovered: {
    hex: "#7dd71d",
    multiplier: 100,
  },
  deaths: {
    hex: "#ff0000",
    multiplier: 600,
  },
};

export const sortData = (data) => {
	const sortedData = [...data];

	sortedData.sort((a,b) => {
		if (a.cases > b.cases) {
			return -1;
		} else { 
			return 1;
		}
	})
	return sortedData;
}

export const prettyPrintStat = (stat) => 
	stat ? `${numeral(stat).format("0,0")}` : "0";

export const showDataOnMap = (data, casesType='cases') => (
	data.map(country => (
		<Circle
			center={[country.countryInfo.lat, country.countryInfo.long]}
			fillOpacity={0.4}
			color={casesTypeColors[casesType].hex}
			fillColor={casesTypeColors[casesType].hex}
			radius={
				Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
			}
		>
			<Popup>   
				<div className="info-container">
					<div
						className="info-flag"
						style={{backgroundImage: `url(${country.countryInfo.flag})`}}
					/>
					<div className="info-name">
						{country.country}
					</div>
					<div className="info-confirmed">
					<span>Cases: {numeral(country.cases).format("0,0")}</span>
					</div>
					<div className="info-recovered">
					<span>Recovered: {numeral(country.recovered).format("0,0")}</span>
					</div>
				 	<div className="info-deaths">
					 <span>Death: {numeral(country.deaths).format("0,0")}</span>
					</div>
					
					
					<div className="info-active">
						 Active: {numeral(country.cases-country.recovered-country.deaths).format("0,0")}
					</div>	
					<div className="info-points">
						Active cases are not accurate for some European countries
					</div>
				</div>
			</Popup>
		</Circle>	
	))
);
