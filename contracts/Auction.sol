pragma solidity ^0.4.18;


contract Auction {

	uint public auctionEnd;
	uint public playerOnBlock;
	address public highestBidder;
	uint public highestBid;
	uint public biddingTime;
    // Allowed withdrawals of previous bids
	// mapping(address => uint) pendingReturns;

	bool ended = true;

	event HighestBidIncreased(address bidder, uint amount);
	event AuctionEnded(address winner, uint amount);

	function Auction(uint _biddingTime) {
		biddingTime = _biddingTime;
	}

	function openAuctionBlock(uint _bid, uint _player) {
		ended = false;
		auctionEnd = block.number + biddingTime;
		playerOnBlock = _player;
		highestBidder = msg.sender;
		highestBid = _bid;

	}
	function bid(uint _bid) public {
		require(!ended);
		require(block.number <= auctionEnd);

		require(_bid > highestBid);

		// if (highestBid != 0) {
		// 	pendingReturns[highestBidder] += highestBid;
		// }
		if ((auctionEnd - block.number) <= 2 && (auctionEnd - block.number) > 0 )
		{
			auctionEnd = auctionEnd + 2;
		}
		highestBidder = msg.sender;
		highestBid = _bid;
		// emit HighestBidIncreased(msg.sender, msg.value);
	}

	// function withdraw() public returns(bool) {
	// 	uint amount = pendingReturns[msg.sender];
	// 	if(amount > 0) {
	// 		pendingReturns[msg.sender] = 0;

	// 		if(!msg.sender.send(amount)) {
	// 			pendingReturns[msg.sender] = amount;
	// 			return false;
	// 		}
	// 	}
	// 	return true;
	// }

	function endAuction() {
		// require(block.number >= auctionEnd);
		require(!ended);

		ended = true;
		// emit AuctionEnded(highestBidder, highestBid);

	}

}