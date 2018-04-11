import ether from './helpers/ether'
import EVMThrow from './helpers/EVMThrow'
import {advanceBlock} from './helpers/advanceToBlock'
import {increaseTimeTo, duration} from './helpers/increaseTime'
import latestTime from './helpers/latestTime'
import EVMExcept from './helpers/EVMexcept'

const league = artifacts.require("League.sol");
const players = artifacts.require("PlayerUniverse.sol");

const BigNumber = web3.BigNumber;
const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('League Parameter Checks', function(accounts) {
	it('Should reflect proper arguments', async function() {
		this.playersContract = await players.new();
		this.draftTime = latestTime() + duration.weeks(1);
		this.leagueContract = await league.new("TestLeague", 10, ether(1), "winner-take-all", this.draftTime, "serpentine", this.playersContract.address);

		(await this.leagueContract.name()).should.be.equal("TestLeague");
		(await this.leagueContract.leagueSize()).should.be.bignumber.equal(10);
		(await this.leagueContract.buyIn()).should.be.bignumber.equal(ether(1));
		(await this.leagueContract.jackpotStyle()).should.be.equal("winner-take-all");
		(await this.leagueContract.draftTime()).should.be.bignumber.equal(this.draftTime);
		(await this.leagueContract.draftStyle()).should.be.equal("serpentine");
	})
})

contract('League Changing draft time', function(accounts) {
	const commissioner = accounts[0];
	beforeEach(async function() {
		this.playersContract = await players.new();
		this.draftTime = latestTime() + duration.weeks(1);
		this.newDraftTime = this.draftTime + duration.days(2)
		this.leagueContract = await league.new("TestLeague", 10, ether(1), "winner-take-all", this.draftTime, "serpentine", this.playersContract.address, {from: accounts[0]});
	})
	it('Allows owner to change draftTime', async function() {
		await this.leagueContract.changeDraftTime(this.newDraftTime, {from: accounts[0]}).should.be.fulfilled;
		(await this.leagueContract.draftTime()).should.be.bignumber.equal(this.newDraftTime);
	})
	it('Rejects a change if the draft is within 1 hour', async function() {
		await increaseTimeTo(this.draftTime - duration.minutes(30));
		await this.leagueContract.changeDraftTime(this.newDraftTime, {from: accounts[0]}).should.be.rejectedWith(EVMExcept);
		(await this.leagueContract.draftTime()).should.be.bignumber.equal(this.draftTime);
	})
	it('Rejects a change if not executed by commissioner', async function() {
		await this.leagueContract.changeDraftTime(this.newDraftTime, {from: accounts[1]}).should.be.rejectedWith(EVMExcept);
		(await this.leagueContract.draftTime()).should.be.bignumber.equal(this.draftTime);
	})
})
contract('League is joinable', function(accounts) {
	beforeEach(async function() {
		this.playersContract = await players.new();
		this.draftTime = latestTime() + duration.days(8);
		this.leagueContract = await league.new("TestLeague", 5, ether(1), "winner-take-all", this.draftTime, "serpentine", this.playersContract.address, {from: accounts[0]});
	})
	it('Allows a user to join the league', async function() {
		await this.leagueContract.joinLeague("testTeam1", {from: accounts[1], value: ether(1)}).should.be.fulfilled;
		(await this.leagueContract.teamCount()).should.be.bignumber.equal(2);
	})
	it('Rejects a user trying to join twice', async function() {
		await this.leagueContract.joinLeague("testTeam1", {from: accounts[1], value: ether(1)}).should.be.fulfilled;
		(await this.leagueContract.teamCount()).should.be.bignumber.equal(2);
		await this.leagueContract.joinLeague("testTeam1", {from: accounts[1], value: ether(1)}).should.be.rejectedWith(EVMExcept);
		(await this.leagueContract.teamCount()).should.be.bignumber.equal(2);
	})
	it("Rejects a user who doesn't pay the buyIn", async function() {
		await this.leagueContract.joinLeague("testTeam1", {from: accounts[1], value: ether(0.5)}).should.be.rejectedWith(EVMExcept);
		(await this.leagueContract.teamCount()).should.be.bignumber.equal(1);
	})
	it("Rejects team joining over the leagueSize", async function() {
		await this.leagueContract.joinLeague("testTeam1", {from: accounts[1], value: ether(1)}).should.be.fulfilled;
		await this.leagueContract.joinLeague("testTeam2", {from: accounts[2], value: ether(1)}).should.be.fulfilled;
		await this.leagueContract.joinLeague("testTeam3", {from: accounts[3], value: ether(1)}).should.be.fulfilled;
		await this.leagueContract.joinLeague("testTeam4", {from: accounts[4], value: ether(1)}).should.be.fulfilled;
		await this.leagueContract.joinLeague("testTeam5", {from: accounts[5], value: ether(1)}).should.be.rejectedWith(EVMExcept);
		(await this.leagueContract.teamCount()).should.be.bignumber.equal(5);
	})
	it("Rejects a team trying to join with no name", async function() {
		await this.leagueContract.joinLeague("", {from: accounts[1], value: ether(1)}).should.be.rejectedWith(EVMExcept);
		(await this.leagueContract.teamCount()).should.be.bignumber.equal(1);

	})
	// it("Rejects a team trying to join with no name arg", async function() {
	// 	await this.leagueContract.joinLeague({from: accounts[1], value: ether(1)}).should.be.rejectedWith(EVMExcept);
	// 	(await this.leagueContract.teamCount()).should.be.bignumber.equal(1);

	// })
})

