# car-auction-api
Backend for a car auction system with the following api endpoints
### Authentication
- `POST /api/v1/auction/token`: Generate token with static credentials (Admin/Admin)
### Auctions
- `POST /api/v1/auction/createAuction`: Create a new auction
- `PATCH /api/v1/auction/status/{auctionId}`: Update auction status
- `GET /api/v1/auction/{auctionId}/winner-bid`: Retrieve winning bid info
### Bids
- `POST /api/v1/auction/placeBids`: Place a bid on an active auction
- `PATCH /api/v1/bid/{bidId}`: Update a bid (own bids only)
- `DELETE /api/v1/bid/{bidId}`: Delete a bid (own bids only)
### Dealers
- `POST /api/v1/dealer/register`: Dealer registration
- `POST /api/v1/dealer/login`: Dealer authentication
- `GET /api/v1/dealer/profile`: Get dealer profile
- `PATCH /api/v1/dealer/profile`: Update dealer profile
## Authentication & Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Access and refresh token generation
- Protected routes with middleware verification

## Bidding Process Flow
1. Dealer registers and authenticates
2. Dealer browses active auctions
3. Dealer selects an auction and places a bid
4. System validates bid is higher than the current highest
5. Auction closes at the end time
6. The winner is determined as the highest bidder
