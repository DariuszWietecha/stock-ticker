Make a dockerised node.js rest service that returns stock ticker prices from the stock exchange of your choice.

For the technical interview, it would also be useful for you to think about these questions:

What architecture, design patterns and nodejs technology decisions have I made?

Założyłem że ticker ma dawać podstawową funkcjonalność ticker data dla wybranych stock-ów, ze wskazaniem rośnie czy spada, lista dostępnych stocków, być gotowy na bardzo dużą listę zapytań(cache), niezależny od źródła danych, replikacja danych we własna bazie danych. Chciałem serwować dane dotyczące polskich stock-ów, ale nie znalazłem darmowego API z danymi odświeżanymi na bierząco. Finnhub to pierwsze free API, które pozwalało na częste zapytania. 

Hapi - generally I decided to use framework to utilize available solutions e.g. for error handnling, and to make the API ready for scaling. Hapi because it is designed for REST API, fast and handle solutions to avoid blocking the event loop out of the box.

jak najprostsze, przez to najwydajniejsze
Redis - najszybsza
Config w .env dla uproszczenia
Swagger for documentation

dwa moduły:
1. Zasilanie bazy w dane
2. Public API
Dwa endpoipnty:
1- ticker data dla wybranych stock-ów
2 - lista dostępnych stocków
aby zapewnić nieprzerwaną aktualizacje - pm2
Informacja o niedostępności źródła danych i braku aktualizacji przez określony czas(do konfigurowania)

How would I implement error handling?
How would I make this scale?
How would I test this solution?
What security requirements could I consider?
przeciążenia

SERVER_LOG_RULE=["*"]
REQUEST_LOG_RULE=false

nazwy symboli z :

1. Zasilanie bazy w dane
- docker
- readme
- unit testy
tslint i parametry
2. Public API
- docker
- readme
- unit testy
? docs

ca to string