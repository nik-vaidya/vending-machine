# vending-machine
Vending machine designed in Node.js which will dispense any item of your choice for cash in rupees, dollars and euros

## Prerequisite
 1. Install MongoDB
 2. Install Node.js
 3. Update `conf.json` according to your configuration
 4. Run `npm install`

## How to Run
To Run this application enter below command
```
npm start
```
To Run this application in debugging mode enter below command
```
DEBUG=vendingmachine:* npm start
```

# REST API

## Fill items in vending machine
 ```
 POST /vendingmachine/inventory/fill/stock
 ```
 Request Headers
 ```
 Content-Type:application/json
 ```
 Request Body
 ```
 [
	{
        "name": "coke",
        "quantity": 3,
        "unitCost": 12
    },
    {
        "name": "mirinda",
        "quantity": 3,
        "unitCost": 12
    }
    
]
 ```
## Get items in vending machine
 ```
 GET /vendingmachine/inventory/get/stock
 ```
 Request Headers
 ```
 Content-Type:application/json
 ```
## Collect the cash
 ```
 POST /vendingmachine/collectCash
 ```
 Request Headers
 ```
 Content-Type:application/json
 ```
 Request Body
 ```
 {
	"amount": 20,
	"currency": "INR"
 } 
 ```
 ## Cancel the transaction
 ```
 POST /vendingmachine/cancel
 ```
 Request Headers
 ```
 Content-Type:application/json
 ```
 Request Body
 ```
 {} 
 ```
 ## Dispense item and change
 ```
 POST /vendingmachine/dispenseitem
 ```
 Request Headers
 ```
 Content-Type:application/json
 ```
 Request Body
 ```
 {
	"name": "coke"
 }
 ```

