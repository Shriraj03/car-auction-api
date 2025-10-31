# car-auction-api
Backend for a car auction system with the following api endpoints
1. POST /api/v1/dealer/register - Register a new dealer with name, email, and password
2. POST /api/v1/dealer/login - Login as dealer using email and password
3. POST /api/v1/car - Add a new car with make, model, and year
4. GET /api/v1/car - Get all cars
5. POST /api/v1/auction/createAuction - Create auction for a car with starting price and time window
6. PATCH /api/v1/auction/status/{auctionId} - Update auction status (activate/close)
7. GET /api/v1/auction - Get all auctions with optional status filter
8. GET /api/v1/auction/{auctionId}/winner-bid - Get highest bid for an auction
9. POST /api/v1/auction/placeBids - Place bid on active auction
10. POST /api/v1/auction/token - Generate admin token for authentication
