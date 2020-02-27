const { expect } = require("chai");

describe("Poll contract", function() {
  let Poll;
  let owner;
  let other1;
  let other2;
  let others;

  beforeEach(async function() {
    Poll = await ethers.getContractFactory("Poll");
    [owner, other1, other2, ...others] = await ethers.getSigners();
  });

  describe("Deployment", function() {
    it("Should set the right owner", async function() {
      const poll = await Poll.deploy("My poll");
      await poll.deployed();

      expect(await poll.owner()).to.equal(await owner.getAddress());
    });

    it("Should set the Poll's name", async function() {
      const pollName = "My Poll";
      const poll = await Poll.deploy(pollName);
      await poll.deployed();

      expect(await poll.name()).to.equal(pollName);
    });

    it("Should start closed", async function() {
      const poll = await Poll.deploy("My Poll");
      await poll.deployed();

      expect(await poll.isOpen()).to.be.false;
    });
  });

  describe("Opening and closing the poll", function() {
    let poll;

    beforeEach(async function() {
      poll = await Poll.deploy("My Poll");
      await poll.deployed();
    });

    describe("Opening", function() {
      it("Should let the owner open the poll", async function() {
        // Every transaction and call is sent with the owner by default
        await poll.open();

        expect(await poll.isOpen()).to.be.true;
      });

      it("Shouldn't let the others open the poll", async function() {
        // poll.connect returns the same Poll contract instance,
        // but associated to a different signer
        await expect(poll.connect(other1).open()).to.be.revertedWith(
          "Ownable: caller is not the owner"
        );

        await expect(poll.connect(other2).open()).to.be.revertedWith(
          "Ownable: caller is not the owner"
        );
      });
    });

    describe("Closing", function() {
      it("Should let the owner open the poll", async function() {
        await poll.open();

        await poll.close();

        expect(await poll.isOpen()).to.be.false;
      });

      it("Shouldn't let the others open the poll", async function() {
        await poll.open();

        await expect(poll.connect(other1).close()).to.be.revertedWith(
          "Ownable: caller is not the owner"
        );

        await expect(poll.connect(other2).close()).to.be.revertedWith(
          "Ownable: caller is not the owner"
        );
      });
    });
  });

  describe("Adding proposals", function() {
    let poll;

    beforeEach(async function() {
      poll = await Poll.deploy("My Poll");
      await poll.deployed();
    });

    describe("Before opening the poll", function() {
      it("Should let the owner add proposals", async function() {
        await expect(poll.addProposal("Proposal 1")).to.not.be.reverted;
      });

      it("Shouldn't let others add proposals", async function() {
        await expect(
          poll.connect(other1).addProposal("Proposal 1")
        ).to.be.revertedWith("Ownable: caller is not the owner");

        await expect(
          poll.connect(other2).addProposal("Proposal 1")
        ).to.be.revertedWith("Ownable: caller is not the owner");
      });

      it("Should set the right values for the proposal, starting with id 0", async function() {
        const description = "Proposal 1";
        await poll.addProposal(description);
        const proposal = await poll.proposals(0);

        expect(proposal.description).to.be.equal(description);
        expect(proposal.votes).to.be.equal(0);
      });

      it("Should emit a ProposalAdded event with the right arguments", async function() {
        const description = "Proposal 1";

        await expect(poll.addProposal(description))
          .to.emit(poll, "ProposalAdded")
          .withArgs(0, description);
      });

      it("Should let the owner add multiple proposals", async function() {
        const description1 = "Proposal 1";
        await poll.addProposal(description1);
        const proposal1 = await poll.proposals(0);

        expect(proposal1.description).to.be.equal(description1);
        expect(proposal1.votes).to.be.equal(0);

        const description2 = "Proposal 2";
        await poll.addProposal(description2);
        const proposal2 = await poll.proposals(1);

        expect(proposal2.description).to.be.equal(description2);
        expect(proposal2.votes).to.be.equal(0);
      });

      it("Should increase the getProposalsCount", async function() {
        expect(await poll.getProposalsCount()).to.equal(0);

        await poll.addProposal("p1");
        expect(await poll.getProposalsCount()).to.equal(1);

        await poll.addProposal("p2");
        expect(await poll.getProposalsCount()).to.equal(2);
      });
    });
  });

  describe("Voting", function() {
    let poll;
    const description1 = "Proposal 1";
    const description2 = "Proposal 2";

    beforeEach(async function() {
      poll = await Poll.deploy("My Poll");
      await poll.deployed();

      // We add a few proposals here
      poll.addProposal(description1);
      poll.addProposal(description2);
    });

    describe("Before opening the poll", function() {
      it("Shouldn't let the owner vote", async function() {
        await expect(poll.vote(0)).to.be.revertedWith("The poll is not open");
      });

      it("Shouldn't let others vote", async function() {
        await expect(poll.connect(other1).vote(0)).to.be.revertedWith(
          "The poll is not open"
        );
        await expect(poll.connect(other2).vote(0)).to.be.revertedWith(
          "The poll is not open"
        );
      });
    });

    describe("After closing the poll", function() {
      beforeEach(async function() {
        await poll.open();
        await poll.close();
      });

      it("Shouldn't let the owner vote", async function() {
        await expect(poll.vote(0)).to.be.revertedWith("The poll is not open");
      });

      it("Shouldn't let others vote", async function() {
        await expect(poll.connect(other1).vote(0)).to.be.revertedWith(
          "The poll is not open"
        );
        await expect(poll.connect(other2).vote(0)).to.be.revertedWith(
          "The poll is not open"
        );
      });
    });

    describe("When the poll is open", function() {
      beforeEach(async function() {
        await poll.open();
      });

      it("Should let the owner vote", async function() {
        await expect(poll.vote(0))
          .to.emit(poll, "VoteCasted")
          .withArgs(0, await owner.getAddress(), 1);

        const proposal = await poll.proposals(0);
        expect(proposal.votes).to.be.equal(1);
      });

      it("Should let others vote", async function() {
        await expect(poll.connect(other1).vote(1))
          .to.emit(poll, "VoteCasted")
          .withArgs(1, await other1.getAddress(), 1);

        let proposal = await poll.proposals(1);
        expect(proposal.votes).to.be.equal(1);

        await expect(poll.connect(other2).vote(1))
          .to.emit(poll, "VoteCasted")
          .withArgs(1, await other2.getAddress(), 2);

        proposal = await poll.proposals(1);
        expect(proposal.votes).to.be.equal(2);
      });

      it("Shouldn't let you vote multiple times", async function() {
        // The first vote should be accepted
        await expect(poll.vote(0))
          .to.emit(poll, "VoteCasted")
          .withArgs(0, await owner.getAddress(), 1);

        // And the counter should be updated
        let proposal = await poll.proposals(0);
        expect(proposal.votes).to.be.equal(1);

        // Successive votes should revert with an specific error message
        await expect(poll.vote(0)).to.be.revertedWith("You have already voted");
        // And the counter should not be updated now
        proposal = await poll.proposals(0);
        expect(proposal.votes).to.be.equal(1);

        // It doesn't matter who you vote for
        await expect(poll.vote(1)).to.be.revertedWith("You have already voted");
        proposal = await poll.proposals(1);
        expect(proposal.votes).to.be.equal(0);

        // Uncomment this for some fun
        // await expect(poll.vote(2)).to.be.revertedWith("You have already voted");
        // proposal = await poll.proposals(2);
        // expect(proposal.votes).to.be.equal(0);
      });
    });
  });
});
