function isRecord(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function positiveInteger(value) {
    return Number.isSafeInteger(value) && value > 0;
}

function requiredText(value, maxLength = 500) {
    return typeof value === 'string' && value.trim().length > 0 && value.trim().length <= maxLength;
}

function optionalText(value, maxLength) {
    return value === undefined || value === null || value === '' ||
        (typeof value === 'string' && value.trim().length <= maxLength);
}

function positiveNumber(value) {
    return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

module.exports = { isRecord, positiveInteger, requiredText, optionalText, positiveNumber };
