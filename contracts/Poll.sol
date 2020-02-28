pragma solidity ^0.5.15;

// We import this contract, which will handle permissions for us
import "@openzeppelin/contracts/ownership/Ownable.sol";

// We will use this for debugging
import "@nomiclabs/buidler/console.sol";

// We make the Poll contract Owneable. This creates an owner permission that we
// use to restrict who can add proposals, open and close the Poll
contract Poll is Ownable {
    struct Proposal {
        string description;
        uint256 votes;
    }

    event ProposalAdded(uint256 proposalId, string description);
    event VoteCasted(uint256 proposalId, address voter, uint256 proposalVotes);

    // Public fields have getters with the same name automatically created
    string public name;
    bool public isOpen;
    // The poposals getter takes an index and returns a proposal object
    Proposal[] public proposals;

    mapping(address => bool) hasVoted;

    constructor(string memory _name) public {
        // Ownable's constructor gets called automatically, initializing the
        // owner as msg.sender
        name = _name;
        isOpen = false;
    }

    function getProposalsCount() public view returns (uint256) {
        return proposals.length;
    }

    function open() public onlyOwner {
        isOpen = true;
    }

    function close() public onlyOwner {
        isOpen = false;
    }

    function addProposal(string memory _description) public onlyOwner {
        require(!isOpen, "Cannot add a proposal to an open poll");

        uint256 id = proposals.length;
        proposals.push(Proposal(_description, 0));

        emit ProposalAdded(id, _description);
    }

    function vote(uint256 _proposalId) public {
        require(isOpen, "The poll is not open");

        proposals[_proposalId].votes += 1;

        require(!hasVoted[msg.sender], "You have already voted");
        hasVoted[msg.sender] = true;

        emit VoteCasted(_proposalId, msg.sender, proposals[_proposalId].votes);
    }

}
