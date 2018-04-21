import ether from './helpers/ether'
import EVMThrow from './helpers/EVMThrow'
import {advanceBlock, advanceToBlock} from './helpers/advanceToBlock'
import {increaseTimeTo, duration} from './helpers/increaseTime'
import latestTime from './helpers/latestTime'
import EVMExcept from './helpers/EVMexcept'

const league = artifacts.require("League.sol");
const team = artifacts.require("Team.sol");
const players = artifacts.require("PlayerUniverse.sol");
const Commissioner = artifacts.require("Commissioner.sol");

const BigNumber = web3.BigNumber;
const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract("Auction Style Draft", function(accounts) {
	beforeEach(async function() {
		this.playersContract = await players.new();
		this.draftTime = latestTime() + duration.weeks(1);
		this.commissionerContract = await Commissioner.new("TestTeam", "TestLeague", 10, ether(1), "winner-take-all", this.draftTime, "serpentine", this.playersContract.address, {from: accounts[0], value: ether(1)}).should.be.fulfilled;
		this.leagueContract = await league.at(await this.commissionerContract.leagueAddress());
		// this.leagueContract = await league.new("TestLeague", 10, ether(1), "winner-take-all", this.draftTime, "serpentine", this.playersContract.address, {from: accounts[0]});
		this.teamContract = await team.new("testTeam1", {from: accounts[1]});
		await this.teamContract.joinLeague(this.leagueContract.address, {from: accounts[1], value: ether(1)}).should.be.fulfilled;
		await increaseTimeTo(this.draftTime);
	})
	it("Puts player on the block and bids up", async function() {
		(await this.leagueContract.draftPick()).should.be.bignumber.equal(1);
		(await this.leagueContract.draftOrder(1)).should.be.bignumber.equal(this.commissionerContract.address);

		//Pick 1 opens bidding
		await this.commissionerContract.auctionBlock(1, 35, {from: accounts[0]}).should.be.fulfilled;
		(await this.leagueContract.highestBidder.call()).should.be.bignumber.equal(this.commissionerContract.address);
		(await this.leagueContract.highestBid.call()).should.be.bignumber.equal(35)

		//Team bids up
		await this.teamContract.auctionBid(50, {from: accounts[1]}).should.be.fulfilled;

		(await this.leagueContract.highestBidder.call()).should.be.bignumber.equal(this.teamContract.address);
		(await this.leagueContract.highestBid.call()).should.be.bignumber.equal(50)


	})
	it("Bids 1 round and opens 2nd round, checks first round completed", async function() {
		//Bids round 1
		await this.commissionerContract.auctionBlock(1, 50, {from: accounts[0]}).should.be.fulfilled;
		//Ends round
		var roundEnd = await this.leagueContract.auctionEnd();
		await advanceToBlock(roundEnd);

		//opens round 2
		await this.teamContract.auctionBlock(2, 55, {from: accounts[1]}).should.be.fulfilled;

		//checks round 1 completed
		(await this.leagueContract.salaryCap(this.commissionerContract.address)).should.be.bignumber.equal(150);
		(await this.commissionerContract.getPlayer.call("QB")).should.be.bignumber.equal(1);
		// (await this.leagueContract.draftedPlayers(1)).should.be.boolean.equal(true);
	})
	it("Fails to bid up after the round ends", async function() {

		//Bids round 1
		await this.commissionerContract.auctionBlock(1, 50, {from: accounts[0]}).should.be.fulfilled;
		//Ends round
		var roundEnd = await this.leagueContract.auctionEnd();
		await advanceToBlock(roundEnd);

		//bid up
		await this.teamContract.auctionBid(50, {from: accounts[1]}).should.be.rejectedWith(EVMExcept);








	})
})