const durationPattern = /^(\d+)([smhdw])$/i;

const durationToMsMap: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
    w: 7 * 24 * 60 * 60 * 1000,
};

const getExpirationMs = (expiresIn: string): number => {
    const normalizedValue = expiresIn.trim();

    if (/^\d+$/.test(normalizedValue)) {
        return Number(normalizedValue) * 1000;
    }

    const match = normalizedValue.match(durationPattern);
    if (!match) {
        throw new Error(`Unsupported token expiration format: ${expiresIn}`);
    }

    const amount = match[1];
    const unit = match[2];

    if (!amount || !unit) {
        throw new Error(`Unsupported token expiration format: ${expiresIn}`);
    }

    const multiplier = durationToMsMap[unit.toLowerCase()];

    if (!multiplier) {
        throw new Error(`Unsupported token expiration unit: ${unit}`);
    }

    return Number(amount) * multiplier;
};

export const getTokenExpirationDate = (expiresIn: string): Date => {
    return new Date(Date.now() + getExpirationMs(expiresIn));
};
