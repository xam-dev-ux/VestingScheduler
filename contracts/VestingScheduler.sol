// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title VestingScheduler
 * @dev Contrato para gestionar múltiples vesting schedules con fees configurables
 * @notice Permite crear vesting schedules individuales o en batch con diferentes configuraciones
 */
contract VestingScheduler is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    // Estructura para definir un vesting schedule
    struct VestingSchedule {
        address beneficiary;        // Beneficiario del vesting
        address token;             // Token ERC20 a vestear
        uint256 totalAmount;       // Cantidad total a vestear
        uint256 startTime;         // Timestamp de inicio
        uint256 cliffDuration;     // Duración del cliff en segundos
        uint256 duration;          // Duración total del vesting en segundos
        uint256 amountClaimed;     // Cantidad ya reclamada
        bool revocable;            // Si el vesting puede ser revocado
        bool revoked;              // Si el vesting ha sido revocado
        address creator;           // Creador del vesting
    }

    // Mapeo de ID de vesting a su schedule
    mapping(uint256 => VestingSchedule) public vestingSchedules;

    // Mapeo de beneficiario a lista de IDs de vesting
    mapping(address => uint256[]) public beneficiaryVestings;

    // Mapeo de creador a lista de IDs de vesting
    mapping(address => uint256[]) public creatorVestings;

    // Contador de vesting schedules
    uint256 public vestingCount;

    // Fee percentage (en basis points, 100 = 1%)
    uint256 public feePercentage;

    // Dirección donde se acumulan los fees
    address public feeCollector;

    // Fees acumulados por token
    mapping(address => uint256) public accumulatedFees;

    // Mínimo de duración de vesting (1 día)
    uint256 public constant MIN_VESTING_DURATION = 1 days;

    // Máximo fee percentage (10%)
    uint256 public constant MAX_FEE_PERCENTAGE = 1000;

    // Eventos
    event VestingCreated(
        uint256 indexed vestingId,
        address indexed beneficiary,
        address indexed token,
        uint256 amount,
        uint256 startTime,
        uint256 duration,
        address creator
    );

    event TokensClaimed(
        uint256 indexed vestingId,
        address indexed beneficiary,
        uint256 amount
    );

    event VestingRevoked(
        uint256 indexed vestingId,
        address indexed beneficiary,
        uint256 amountReturned
    );

    event FeePercentageUpdated(uint256 oldFee, uint256 newFee);

    event FeeCollectorUpdated(address oldCollector, address newCollector);

    event FeesWithdrawn(address indexed token, uint256 amount);

    event BatchVestingCreated(uint256 indexed startId, uint256 count);

    /**
     * @dev Constructor
     * @param _feePercentage Fee inicial en basis points (100 = 1%)
     * @param _feeCollector Dirección que recibirá los fees
     */
    constructor(uint256 _feePercentage, address _feeCollector) Ownable(msg.sender) {
        require(_feePercentage <= MAX_FEE_PERCENTAGE, "Fee too high");
        require(_feeCollector != address(0), "Invalid fee collector");

        feePercentage = _feePercentage;
        feeCollector = _feeCollector;
    }

    /**
     * @dev Crea un nuevo vesting schedule
     * @param beneficiary Dirección del beneficiario
     * @param token Dirección del token ERC20
     * @param totalAmount Cantidad total a vestear
     * @param startTime Timestamp de inicio (0 para iniciar inmediatamente)
     * @param cliffDuration Duración del cliff en segundos
     * @param duration Duración total del vesting en segundos
     * @param revocable Si el vesting puede ser revocado
     */
    function createVesting(
        address beneficiary,
        address token,
        uint256 totalAmount,
        uint256 startTime,
        uint256 cliffDuration,
        uint256 duration,
        bool revocable
    ) external nonReentrant whenNotPaused returns (uint256) {
        require(beneficiary != address(0), "Invalid beneficiary");
        require(token != address(0), "Invalid token");
        require(totalAmount > 0, "Amount must be > 0");
        require(duration >= MIN_VESTING_DURATION, "Duration too short");
        require(cliffDuration <= duration, "Cliff > duration");

        uint256 actualStartTime = startTime == 0 ? block.timestamp : startTime;
        require(actualStartTime >= block.timestamp, "Start time in past");

        // Calcular fee
        uint256 fee = (totalAmount * feePercentage) / 10000;
        uint256 amountAfterFee = totalAmount - fee;

        // Transferir tokens desde el creador
        IERC20(token).safeTransferFrom(msg.sender, address(this), totalAmount);

        // Acumular fee
        if (fee > 0) {
            accumulatedFees[token] += fee;
        }

        // Crear vesting schedule
        uint256 vestingId = vestingCount++;

        vestingSchedules[vestingId] = VestingSchedule({
            beneficiary: beneficiary,
            token: token,
            totalAmount: amountAfterFee,
            startTime: actualStartTime,
            cliffDuration: cliffDuration,
            duration: duration,
            amountClaimed: 0,
            revocable: revocable,
            revoked: false,
            creator: msg.sender
        });

        beneficiaryVestings[beneficiary].push(vestingId);
        creatorVestings[msg.sender].push(vestingId);

        emit VestingCreated(
            vestingId,
            beneficiary,
            token,
            amountAfterFee,
            actualStartTime,
            duration,
            msg.sender
        );

        return vestingId;
    }

    /**
     * @dev Crea múltiples vesting schedules en una sola transacción
     * @param beneficiaries Array de beneficiarios
     * @param tokens Array de direcciones de tokens
     * @param amounts Array de cantidades
     * @param startTimes Array de timestamps de inicio
     * @param cliffDurations Array de duraciones de cliff
     * @param durations Array de duraciones totales
     * @param revocables Array de flags de revocable
     */
    function createBatchVesting(
        address[] calldata beneficiaries,
        address[] calldata tokens,
        uint256[] calldata amounts,
        uint256[] calldata startTimes,
        uint256[] calldata cliffDurations,
        uint256[] calldata durations,
        bool[] calldata revocables
    ) external nonReentrant whenNotPaused returns (uint256[] memory) {
        uint256 count = beneficiaries.length;
        require(count > 0, "Empty array");
        require(
            tokens.length == count &&
            amounts.length == count &&
            startTimes.length == count &&
            cliffDurations.length == count &&
            durations.length == count &&
            revocables.length == count,
            "Array length mismatch"
        );

        uint256[] memory vestingIds = new uint256[](count);
        uint256 startId = vestingCount;

        for (uint256 i = 0; i < count; i++) {
            require(beneficiaries[i] != address(0), "Invalid beneficiary");
            require(tokens[i] != address(0), "Invalid token");
            require(amounts[i] > 0, "Amount must be > 0");
            require(durations[i] >= MIN_VESTING_DURATION, "Duration too short");
            require(cliffDurations[i] <= durations[i], "Cliff > duration");

            uint256 actualStartTime = startTimes[i] == 0 ? block.timestamp : startTimes[i];
            require(actualStartTime >= block.timestamp, "Start time in past");

            // Calcular fee
            uint256 fee = (amounts[i] * feePercentage) / 10000;
            uint256 amountAfterFee = amounts[i] - fee;

            // Transferir tokens
            IERC20(tokens[i]).safeTransferFrom(msg.sender, address(this), amounts[i]);

            // Acumular fee
            if (fee > 0) {
                accumulatedFees[tokens[i]] += fee;
            }

            // Crear vesting schedule
            uint256 vestingId = vestingCount++;
            vestingIds[i] = vestingId;

            vestingSchedules[vestingId] = VestingSchedule({
                beneficiary: beneficiaries[i],
                token: tokens[i],
                totalAmount: amountAfterFee,
                startTime: actualStartTime,
                cliffDuration: cliffDurations[i],
                duration: durations[i],
                amountClaimed: 0,
                revocable: revocables[i],
                revoked: false,
                creator: msg.sender
            });

            beneficiaryVestings[beneficiaries[i]].push(vestingId);
            creatorVestings[msg.sender].push(vestingId);

            emit VestingCreated(
                vestingId,
                beneficiaries[i],
                tokens[i],
                amountAfterFee,
                actualStartTime,
                durations[i],
                msg.sender
            );
        }

        emit BatchVestingCreated(startId, count);

        return vestingIds;
    }

    /**
     * @dev Calcula la cantidad disponible para reclamar
     * @param vestingId ID del vesting schedule
     */
    function getClaimableAmount(uint256 vestingId) public view returns (uint256) {
        VestingSchedule memory schedule = vestingSchedules[vestingId];

        if (schedule.revoked) {
            return 0;
        }

        if (block.timestamp < schedule.startTime + schedule.cliffDuration) {
            return 0;
        }

        uint256 vestedAmount = _calculateVestedAmount(schedule);
        return vestedAmount - schedule.amountClaimed;
    }

    /**
     * @dev Calcula la cantidad total vested hasta el momento
     */
    function _calculateVestedAmount(VestingSchedule memory schedule)
        private
        view
        returns (uint256)
    {
        if (block.timestamp < schedule.startTime + schedule.cliffDuration) {
            return 0;
        }

        if (block.timestamp >= schedule.startTime + schedule.duration) {
            return schedule.totalAmount;
        }

        uint256 timeFromStart = block.timestamp - schedule.startTime;
        return (schedule.totalAmount * timeFromStart) / schedule.duration;
    }

    /**
     * @dev Reclama tokens vested disponibles
     * @param vestingId ID del vesting schedule
     */
    function claim(uint256 vestingId) external nonReentrant {
        VestingSchedule storage schedule = vestingSchedules[vestingId];
        require(schedule.beneficiary == msg.sender, "Not beneficiary");
        require(!schedule.revoked, "Vesting revoked");

        uint256 claimableAmount = getClaimableAmount(vestingId);
        require(claimableAmount > 0, "Nothing to claim");

        schedule.amountClaimed += claimableAmount;

        IERC20(schedule.token).safeTransfer(schedule.beneficiary, claimableAmount);

        emit TokensClaimed(vestingId, schedule.beneficiary, claimableAmount);
    }

    /**
     * @dev Revoca un vesting schedule (solo el creador)
     * @param vestingId ID del vesting schedule
     */
    function revokeVesting(uint256 vestingId) external nonReentrant {
        VestingSchedule storage schedule = vestingSchedules[vestingId];
        require(schedule.creator == msg.sender, "Not creator");
        require(schedule.revocable, "Not revocable");
        require(!schedule.revoked, "Already revoked");

        schedule.revoked = true;

        uint256 vestedAmount = _calculateVestedAmount(schedule);
        uint256 claimableAmount = vestedAmount - schedule.amountClaimed;

        // Transferir lo vested al beneficiario
        if (claimableAmount > 0) {
            schedule.amountClaimed += claimableAmount;
            IERC20(schedule.token).safeTransfer(schedule.beneficiary, claimableAmount);
        }

        // Devolver el resto al creador
        uint256 returnAmount = schedule.totalAmount - vestedAmount;
        if (returnAmount > 0) {
            IERC20(schedule.token).safeTransfer(schedule.creator, returnAmount);
        }

        emit VestingRevoked(vestingId, schedule.beneficiary, returnAmount);
    }

    /**
     * @dev Actualiza el porcentaje de fee (solo owner)
     * @param newFeePercentage Nuevo fee en basis points
     */
    function setFeePercentage(uint256 newFeePercentage) external onlyOwner {
        require(newFeePercentage <= MAX_FEE_PERCENTAGE, "Fee too high");
        uint256 oldFee = feePercentage;
        feePercentage = newFeePercentage;
        emit FeePercentageUpdated(oldFee, newFeePercentage);
    }

    /**
     * @dev Actualiza el collector de fees (solo owner)
     * @param newFeeCollector Nueva dirección del fee collector
     */
    function setFeeCollector(address newFeeCollector) external onlyOwner {
        require(newFeeCollector != address(0), "Invalid address");
        address oldCollector = feeCollector;
        feeCollector = newFeeCollector;
        emit FeeCollectorUpdated(oldCollector, newFeeCollector);
    }

    /**
     * @dev Retira los fees acumulados (solo owner)
     * @param token Dirección del token a retirar
     */
    function withdrawFees(address token) external onlyOwner nonReentrant {
        uint256 amount = accumulatedFees[token];
        require(amount > 0, "No fees to withdraw");

        accumulatedFees[token] = 0;
        IERC20(token).safeTransfer(feeCollector, amount);

        emit FeesWithdrawn(token, amount);
    }

    /**
     * @dev Pausa el contrato (solo owner)
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Despausa el contrato (solo owner)
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Obtiene todos los vestings de un beneficiario
     * @param beneficiary Dirección del beneficiario
     */
    function getBeneficiaryVestings(address beneficiary)
        external
        view
        returns (uint256[] memory)
    {
        return beneficiaryVestings[beneficiary];
    }

    /**
     * @dev Obtiene todos los vestings creados por una dirección
     * @param creator Dirección del creador
     */
    function getCreatorVestings(address creator)
        external
        view
        returns (uint256[] memory)
    {
        return creatorVestings[creator];
    }

    /**
     * @dev Obtiene información detallada de un vesting
     * @param vestingId ID del vesting
     */
    function getVestingDetails(uint256 vestingId)
        external
        view
        returns (
            address beneficiary,
            address token,
            uint256 totalAmount,
            uint256 startTime,
            uint256 cliffDuration,
            uint256 duration,
            uint256 amountClaimed,
            uint256 claimableAmount,
            bool revocable,
            bool revoked,
            address creator
        )
    {
        VestingSchedule memory schedule = vestingSchedules[vestingId];
        return (
            schedule.beneficiary,
            schedule.token,
            schedule.totalAmount,
            schedule.startTime,
            schedule.cliffDuration,
            schedule.duration,
            schedule.amountClaimed,
            getClaimableAmount(vestingId),
            schedule.revocable,
            schedule.revoked,
            schedule.creator
        );
    }
}
