# Stock-ticker


## Introduction

Simple REST API provides stock ticker data for required securities based on Node.js and Redis. 

Feeder for it was implemented in [https://github.com/DariuszWietecha/stock-ticker-feeder](https://github.com/DariuszWietecha/stock-ticker-feeder).

## Endpoints

1. Get securities list
* Request: 

  Method: `GET`

  URL: `https://example.com/symbols`

* Response example:
```
[
  {
    "description": "APPLE INC",
    "displaySymbol": "AAPL",
    "symbol": "AAPL"
  },
  {
    "description": "MICROSOFT CORP",
    "displaySymbol": "MSFT",
    "symbol": "MSFT"
  }
  ...
]
```

2. Get ticker data for required securities
* Request: 

  Method: `GET`

  URL: `https://example.com/tickers/{symbol 1st}/{symbol 1st}/...{symbol n}`

Ticker data is available only for stocks listed in response from `Get securities list` endpoint.

* Response example for `https://example.com/tickers/AAPL/MSFT`:
```
[
  {
    "p": "314.4",
    "s": "AAPL",
    "pc": "314.96",
    "t": "1589930233941",
    "v": "5",
    "cd": "down",
    "ca": "-0.56"
  },
  {
    "p": "183.98",
    "s": "MSFT",
    "pc": "184.91",
    "t": "1589930239480",
    "v": "5",
    "cd": "down",
    "ca": "-0.93"
  }
]]
```

Meaning of the attributes:
| Attribute | Attribute name | Description |
| --------- | -------------- | ----------- |
| p | Price Traded |	The price per share for the particular trade (the last bid price). |
| s | Ticker Symbol |	The unique characters used to identify the company. |
| pc | Previous close price |	Close price from previous day. |
| t | Timestamp. |	UNIX milliseconds timestamp of the last trade. |
| v | Shares Traded |	The volume for the trade being quoted. |
| cd | Change Direction |	Shows whether the stock is trading higher or lower than the previous day's closing price. |
| ca | Change Amount | The difference in price from the previous day's close. |

## Implementation details

API and feeder were implemented as separate services to increase the reliability of the first.

API use Redis database and cache `Get ticker data for required securities` endpoint for 1000 milliseconds to be able to handle a big load.

The API holded on 1100 `stock-ticker-100.herokuapp.com/tickers/AAPL/GM/INTC/MSFT/NKE/NVDA/TSLA` requests per second for 1 min with 0.0 % err rate and 310 ms avg resp - [details of the test](https://bit.ly/2WUsu2O).

Source of real US stocks trade data is [Finnhub API](https://finnhub.io/). 

Used dependencies:
- [@hapi/hapi](https://github.com/hapijs/hapi)
- [redis-connection](https://github.com/dwyl/redis-connection)
- [ws](https://github.com/websockets/ws)
- [dotenv](https://github.com/motdotla/dotenv)
- [@hapi/code](https://github.com/hapijs/code)
- [@hapi/lab](https://github.com/hapijs/lab)
- [rewire](https://github.com/jhnns/rewire)
- [sinon](https://github.com/sinonjs/sinon)

During the implementation was used node v12.0.0.


## Running the app

### Running localy

1. Install dependencies using 

`npm install`.

2. Copy `example.env` as `.env` and update it with real passwords and Redis instance host. To change the `host/port` to different than `0.0.0.0/8080` add `HOST` and `PORT` variable to the .env file.
3. Run app using

`npm start`.

4. The App will be available on [http://0.0.0.0:8080](http://0.0.0.0:8080)(If host/port wasn't changed by `.env`).

### Running in the docker container

1.  Copy `example.env` as `.env` and update it with real passwords and redis instance host. To change the host/port to different than 0.0.0.0/8080 add HOST and PORT variable to the .env file.
2. Install Docker.
3. Build the image: 

`docker build -t stock-ticker .`

4. Run image:

`docker run --env-file .env -p 8000:8080 stock-ticker` (windows)

`docker run --env-file ./env -p 8000:8080 stock-ticker` (linux)

5. API will be available on [http://localhost:8000](http://localhost:8000)(or another host proper for your docker).


## Unit tests

[Coverage](https://github.com/DariuszWietecha/stock-ticker/blob/master/coverage.html): 95.79%

#### Running tests

1. Install dependencies and build using `npm install`.
2. Run unit tests by `npm test`.
3. To check test coverage run `npm run test-cov` or `test-cov-html`(It creates a report in [coverage.html](https://github.com/DariuszWietecha/stock-ticker-feeder/blob/master/coverage.html)).

## Notes

* .vscode directory was committed to the repository to let to debug the workflow execution and unit tests execution in VSCode.
