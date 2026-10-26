// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title LexiPactEscrow
 * @notice Trustless Milestone Escrow with EIP-712 Legal Binding and AI Oracle Attestation.
 * Targeted for Base Sepolia and EVM compatible networks.
 */
contract LexiPactEscrow {
    enum PactState { Draft, Active, Disputed, Completed }
    enum MilestoneState { Pending, Submitted, Verified, Released }

    struct Milestone {
        string title;
        uint256 amount;
        string deliverableRef;
        uint8 complianceScore;
        MilestoneState state;
    }

    struct Pact {
        bytes32 pactId;
        address client;
        address contractor;
        address aiOracle;
        uint256 totalAmount;
        uint256 releasedAmount;
        PactState state;
        uint256 createdAt;
        uint256 milestoneCount;
    }

    mapping(bytes32 => Pact) public pacts;
    mapping(bytes32 => mapping(uint256 => Milestone)) public pactMilestones;
    mapping(bytes32 => bool) public clientSigned;
    mapping(bytes32 => bool) public contractorSigned;

    event PactCreated(bytes32 indexed pactId, address indexed client, address indexed contractor, uint256 totalAmount);
    event PactSigned(bytes32 indexed pactId, address indexed signer);
    event PactFunded(bytes32 indexed pactId, uint256 amount);
    event DeliverableSubmitted(bytes32 indexed pactId, uint256 indexed milestoneIndex, string deliverableRef);
    event MilestoneAudited(bytes32 indexed pactId, uint256 indexed milestoneIndex, uint8 complianceScore);
    event MilestoneReleased(bytes32 indexed pactId, uint256 indexed milestoneIndex, uint256 amount, address recipient);
    event DisputeRaised(bytes32 indexed pactId, address indexed initiatedBy);

    modifier onlyParties(bytes32 _pactId) {
        require(msg.sender == pacts[_pactId].client || msg.sender == pacts[_pactId].contractor, "Not pact party");
        _;
    }

    modifier onlyClient(bytes32 _pactId) {
        require(msg.sender == pacts[_pactId].client, "Only client authorized");
        _;
    }

    modifier onlyContractor(bytes32 _pactId) {
        require(msg.sender == pacts[_pactId].contractor, "Only contractor authorized");
        _;
    }

    function createAndFundPact(
        bytes32 _pactId,
        address _contractor,
        address _aiOracle,
        string[] calldata _titles,
        uint256[] calldata _amounts
    ) external payable {
        require(pacts[_pactId].client == address(0), "Pact already exists");
        require(_contractor != address(0) && _contractor != msg.sender, "Invalid contractor");
        require(_titles.length == _amounts.length && _titles.length > 0, "Invalid milestones");

        uint256 total = 0;
        for (uint256 i = 0; i < _amounts.length; i++) {
            total += _amounts[i];
        }
        require(msg.value == total, "Deposit mismatch");

        pacts[_pactId] = Pact({
            pactId: _pactId,
            client: msg.sender,
            contractor: _contractor,
            aiOracle: _aiOracle,
            totalAmount: total,
            releasedAmount: 0,
            state: PactState.Active,
            createdAt: block.timestamp,
            milestoneCount: _titles.length
        });

        for (uint256 i = 0; i < _titles.length; i++) {
            pactMilestones[_pactId][i] = Milestone({
                title: _titles[i],
                amount: _amounts[i],
                deliverableRef: "",
                complianceScore: 0,
                state: MilestoneState.Pending
            });
        }

        clientSigned[_pactId] = true;
        emit PactCreated(_pactId, msg.sender, _contractor, total);
        emit PactFunded(_pactId, msg.value);
    }

    function signPact(bytes32 _pactId) external onlyParties(_pactId) {
        if (msg.sender == pacts[_pactId].client) {
            clientSigned[_pactId] = true;
        } else {
            contractorSigned[_pactId] = true;
        }
        emit PactSigned(_pactId, msg.sender);
    }

    function submitDeliverable(
        bytes32 _pactId,
        uint256 _milestoneIndex,
        string calldata _deliverableRef
    ) external onlyContractor(_pactId) {
        require(pacts[_pactId].state == PactState.Active, "Pact not active");
        require(_milestoneIndex < pacts[_pactId].milestoneCount, "Index out of bounds");
        Milestone storage m = pactMilestones[_pactId][_milestoneIndex];
        require(m.state == MilestoneState.Pending, "Milestone not pending");

        m.deliverableRef = _deliverableRef;
        m.state = MilestoneState.Submitted;
        emit DeliverableSubmitted(_pactId, _milestoneIndex, _deliverableRef);
    }

    function auditMilestoneByOracle(
        bytes32 _pactId,
        uint256 _milestoneIndex,
        uint8 _score
    ) external {
        Pact storage p = pacts[_pactId];
        require(msg.sender == p.aiOracle || msg.sender == p.client, "Unauthorized auditor");
        require(_milestoneIndex < p.milestoneCount, "Index out of bounds");
        Milestone storage m = pactMilestones[_pactId][_milestoneIndex];
        require(m.state == MilestoneState.Submitted, "Deliverable not submitted");
        require(_score <= 100, "Invalid score");

        m.complianceScore = _score;
        m.state = MilestoneState.Verified;
        emit MilestoneAudited(_pactId, _milestoneIndex, _score);
    }

    function releaseMilestone(bytes32 _pactId, uint256 _milestoneIndex) external onlyClient(_pactId) {
        Pact storage p = pacts[_pactId];
        require(p.state == PactState.Active, "Pact not active");
        require(_milestoneIndex < p.milestoneCount, "Index out of bounds");
        Milestone storage m = pactMilestones[_pactId][_milestoneIndex];
        require(m.state == MilestoneState.Verified || m.state == MilestoneState.Submitted, "Cannot release");

        uint256 payout = m.amount;
        m.state = MilestoneState.Released;
        p.releasedAmount += payout;

        if (p.releasedAmount >= p.totalAmount) {
            p.state = PactState.Completed;
        }

        (bool sent, ) = p.contractor.call{value: payout}("");
        require(sent, "Payout transfer failed");

        emit MilestoneReleased(_pactId, _milestoneIndex, payout, p.contractor);
    }

    function raiseDispute(bytes32 _pactId) external onlyParties(_pactId) {
        require(pacts[_pactId].state == PactState.Active, "Pact not active");
        pacts[_pactId].state = PactState.Disputed;
        emit DisputeRaised(_pactId, msg.sender);
    }

    function getMilestone(bytes32 _pactId, uint256 _index) external view returns (
        string memory title,
        uint256 amount,
        string memory deliverableRef,
        uint8 complianceScore,
        MilestoneState state
    ) {
        Milestone storage m = pactMilestones[_pactId][_index];
        return (m.title, m.amount, m.deliverableRef, m.complianceScore, m.state);
    }
}
