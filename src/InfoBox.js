 import React from 'react';
 import { Card, CardContent, Typography } from "@material-ui/core";
 import './InfoBox.css'; 

 function InfoBox({ title, text, cases, isBlue,isGreen, isRed, active, total, ...props}) { 
	 return (
		 <Card onClick={props.onClick} className={`infoBox ${active && "infoBox--selected"}
		 	${isRed && "infoBox--red"} ${isBlue && "infoBox--blue"}
		 `}> 
			<CardContent>
				<Typography className="infoBox__title" color="textSecondary">{title}</Typography>	

				<h2 className={`infoBox__cases ${isGreen && "infoBox__cases--green"}
		 		${isRed && "infoBox__cases--red"} ${isBlue && "infoBox__cases--blue"} 
				`}>{cases}</h2>

				<Typography className="infoBox__total" color="textSecondary">
				Total {text}  
				</Typography>

				<h3 className={`keval ${isGreen && "infoBox__cases--green"}
		 		${isRed && "infoBox__cases--red"} ${isBlue && "infoBox__cases--blue"}`}>{total}</h3>
			</CardContent>	
		 </Card>
	 )
 }
 
 export default InfoBox
 