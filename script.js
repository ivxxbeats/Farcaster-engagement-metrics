// ============================================================
// FARCASTER GENERATIVE ART - FULL ENGINE
// ============================================================

function createSeededRandom(seed) {
    let state = seed;
    return function() {
        state ^= state << 13;
        state ^= state >> 17;
        state ^= state << 5;
        return Math.abs(state) / 0x7fffffff;
    };
}

const traitCategories = {
    fractalType: {
        name: "FRACTAL TYPE",
        options: ["Mandelbrot", "Julia", "Burning Ship", "Tricorn", "Phoenix", "Celtic", "Sierpinski", "Barnsley", "Dragon", "Koch"]
    },
    structure: {
        name: "PATTERN",
        options: ["Voronoi", "Galaxy", "Lightning", "Hexagonal", "Flower", "Star", "Plasma", "SpiralGalaxy", "CrystalCluster", "Fireworks", "Ripple", "Kaleidoscope"]
    },
    density: {
        name: "DENSITY",
        options: ["Light", "Medium", "Dense", "Very Dense"]
    },
    edgeStyle: {
        name: "EDGE",
        options: ["Sharp", "Soft", "Glowing", "Neon"]
    },
    motion: {
        name: "MOTION",
        options: ["Pulsing", "Flowing", "Warping", "Spinning"]
    },
    colorMood: {
        name: "COLOR",
        options: ["Neon", "Electric", "Rainbow", "Hypercolor"]
    },
    glitchType: {
        name: "GLITCH",
        options: ["RGB Split", "Chromatic", "Wave", "Scanlines"]
    }
};

function generateRandomTraits(rand) {
    const traits = {};
    for (const [key, category] of Object.entries(traitCategories)) {
        const randomIndex = Math.floor(rand() * category.options.length);
        traits[key] = {
            name: category.name,
            value: category.options[randomIndex],
            key: key
        };
    }
    return traits;
}

function displayTraits(traits) {
    const grid = document.getElementById('traitsGrid');
    if (!grid) return;
    
    let html = '';
    for (const [key, trait] of Object.entries(traits)) {
        let displayValue = trait.value;
        if (displayValue.length > 18) {
            displayValue = displayValue.substring(0, 15) + '...';
        }
        html += `
            <div class="trait-card">
                <div class="trait-name">${trait.name}</div>
                <div class="trait-value" title="${trait.value}">${displayValue}</div>
            </div>
        `;
    }
    grid.innerHTML = html;
}

let farcasterMetrics = {
    dailyActiveUsers: 50000,
    monthlyActiveUsers: 250000,
    reactionVelocity: 450,
    castVolume: 25000,
    userGrowth: 5000,
    timeOfDay: new Date().getHours() / 24,
    rarityTier: 0
};

function normalizeMetrics(metrics) {
    let rawDau = Math.min(1, metrics.dailyActiveUsers / 100000);
    let rawMau = Math.min(1, metrics.monthlyActiveUsers / 500000);
    let rawReaction = Math.min(1, metrics.reactionVelocity / 1000);
    let rawCast = Math.min(1, metrics.castVolume / 50000);
    let rawGrowth = Math.min(1, metrics.userGrowth / 10000);
    
    return {
        dau: rawDau,
        mau: rawMau,
        reactionVelocity: rawReaction,
        castVolume: rawCast,
        userGrowth: rawGrowth,
        timeOfDay: metrics.timeOfDay
    };
}

function setLowEngagement() {
    farcasterMetrics.dailyActiveUsers = 10000;
    farcasterMetrics.monthlyActiveUsers = 50000;
    farcasterMetrics.reactionVelocity = 100;
    farcasterMetrics.castVolume = 5000;
    farcasterMetrics.userGrowth = 1000;
    updateMetricDisplay();
    updateDebugPanel("LOW ENGAGEMENT - Subtle, calm visuals");
    forceRedraw();
}

function setMaxEngagement() {
    farcasterMetrics.dailyActiveUsers = 100000;
    farcasterMetrics.monthlyActiveUsers = 500000;
    farcasterMetrics.reactionVelocity = 1000;
    farcasterMetrics.castVolume = 50000;
    farcasterMetrics.userGrowth = 10000;
    updateMetricDisplay();
    updateDebugPanel("MAX ENGAGEMENT - Complex, vibrant visuals");
    forceRedraw();
}

function randomizeMetrics() {
    farcasterMetrics.dailyActiveUsers = Math.floor(10000 + Math.random() * 90000);
    farcasterMetrics.monthlyActiveUsers = Math.floor(50000 + Math.random() * 450000);
    farcasterMetrics.reactionVelocity = Math.floor(100 + Math.random() * 900);
    farcasterMetrics.castVolume = Math.floor(5000 + Math.random() * 45000);
    farcasterMetrics.userGrowth = Math.floor(1000 + Math.random() * 9000);
    updateMetricDisplay();
    updateDebugPanel(`RANDOM STATE - DAU: ${Math.round(farcasterMetrics.dailyActiveUsers/1000)}k`);
    forceRedraw();
}

function resetMetrics() {
    farcasterMetrics.dailyActiveUsers = 50000;
    farcasterMetrics.monthlyActiveUsers = 250000;
    farcasterMetrics.reactionVelocity = 450;
    farcasterMetrics.castVolume = 25000;
    farcasterMetrics.userGrowth = 5000;
    updateMetricDisplay();
    updateDebugPanel("RESET to default");
    forceRedraw();
}

function updateMetricDisplay() {
    document.getElementById('dauValue').innerText = farcasterMetrics.dailyActiveUsers.toLocaleString();
    document.getElementById('mauValue').innerText = farcasterMetrics.monthlyActiveUsers.toLocaleString();
    document.getElementById('reactionValue').innerText = Math.floor(farcasterMetrics.reactionVelocity);
    document.getElementById('castValue').innerText = farcasterMetrics.castVolume.toLocaleString();
    document.getElementById('growthValue').innerText = farcasterMetrics.userGrowth.toLocaleString();
}

function updateDebugPanel(message) {
    const panel = document.getElementById('debugPanel');
    if (panel) {
        panel.innerHTML = `🔍 ${message}<br>📊 DAU: ${(farcasterMetrics.dailyActiveUsers/1000).toFixed(0)}k | Cast: ${(farcasterMetrics.castVolume/1000).toFixed(0)}k`;
    }
}

function forceRedraw() {
    if (currentTraits) {
        drawArt(currentSeed, currentTraits, performance.now());
    }
}

// Fractal pattern generators
function mandelbrotPattern(x, y, maxIterations) {
    let zx = 0, zy = 0;
    let cx = x * 2 - 1;
    let cy = y * 2 - 1;
    for (let i = 0; i < maxIterations; i++) {
        const zx2 = zx * zx;
        const zy2 = zy * zy;
        if (zx2 + zy2 > 4) return i / maxIterations;
        zy = 2 * zx * zy + cy;
        zx = zx2 - zy2 + cx;
    }
    return 1;
}

function juliaPattern(x, y, maxIterations, seed) {
    let zx = x * 2 - 1;
    let zy = y * 2 - 1;
    const cx = -0.7269 + seed * 0.2;
    const cy = 0.1889 + seed * 0.2;
    for (let i = 0; i < maxIterations; i++) {
        const zx2 = zx * zx;
        const zy2 = zy * zy;
        if (zx2 + zy2 > 4) return i / maxIterations;
        zy = 2 * zx * zy + cy;
        zx = zx2 - zy2 + cx;
    }
    return 1;
}

function burningShipPattern(x, y, maxIterations) {
    let zx = 0, zy = 0;
    let cx = x * 2 - 1;
    let cy = y * 2 - 1;
    for (let i = 0; i < maxIterations; i++) {
        const zx2 = zx * zx;
        const zy2 = zy * zy;
        if (zx2 + zy2 > 4) return i / maxIterations;
        zy = Math.abs(2 * zx * zy) + cy;
        zx = zx2 - zy2 + cx;
    }
    return 1;
}

function tricornPattern(x, y, maxIterations) {
    let zx = 0, zy = 0;
    let cx = x * 2 - 1;
    let cy = y * 2 - 1;
    for (let i = 0; i < maxIterations; i++) {
        const zx2 = zx * zx;
        const zy2 = zy * zy;
        if (zx2 + zy2 > 4) return i / maxIterations;
        zy = -2 * zx * zy + cy;
        zx = zx2 - zy2 + cx;
    }
    return 1;
}

function phoenixPattern(x, y, maxIterations, seed) {
    let zx = x * 2 - 1;
    let zy = y * 2 - 1;
    let prevZx = 0, prevZy = 0;
    const cx = -0.5 + seed * 0.3;
    const cy = 0.0;
    for (let i = 0; i < maxIterations; i++) {
        const zx2 = zx * zx;
        const zy2 = zy * zy;
        if (zx2 + zy2 > 4) return i / maxIterations;
        const newZx = zx2 - zy2 + cx + 0.5 * prevZx;
        const newZy = 2 * zx * zy + cy + 0.5 * prevZy;
        prevZx = zx;
        prevZy = zy;
        zx = newZx;
        zy = newZy;
    }
    return 1;
}

function celticPattern(x, y, maxIterations) {
    let zx = 0, zy = 0;
    let cx = x * 2 - 1;
    let cy = y * 2 - 1;
    for (let i = 0; i < maxIterations; i++) {
        const zx2 = zx * zx;
        const zy2 = zy * zy;
        if (zx2 + zy2 > 4) return i / maxIterations;
        const newZx = Math.abs(zx2 - zy2) + cx;
        const newZy = Math.abs(2 * zx * zy) + cy;
        zx = newZx;
        zy = newZy;
    }
    return 1;
}

function sierpinskiPattern(x, y, maxIterations) {
    let px = x;
    let py = y;
    for (let i = 0; i < maxIterations; i++) {
        const choice = Math.floor(px * 3 + py * 2) % 3;
        if (choice === 0) {
            px = px / 2;
            py = py / 2;
        } else if (choice === 1) {
            px = (px + 1) / 2;
            py = py / 2;
        } else {
            px = (px + 0.5) / 2;
            py = (py + 1) / 2;
        }
        if (px < 0 || px > 1 || py < 0 || py > 1) return i / maxIterations;
    }
    return 1 - (Math.abs(px - 0.5) + Math.abs(py - 0.5));
}

function barnsleyPattern(x, y, maxIterations) {
    let px = x;
    let py = y;
    for (let i = 0; i < maxIterations; i++) {
        const r = Math.random();
        if (r < 0.01) {
            px = 0;
            py = 0.16 * py;
        } else if (r < 0.86) {
            px = 0.85 * px + 0.04 * py;
            py = -0.04 * px + 0.85 * py + 1.6;
        } else if (r < 0.93) {
            px = 0.2 * px - 0.26 * py;
            py = 0.23 * px + 0.22 * py + 1.6;
        } else {
            px = -0.15 * px + 0.28 * py;
            py = 0.26 * px + 0.24 * py + 0.44;
        }
        if (Math.abs(px) > 10 || Math.abs(py) > 10) return i / maxIterations;
    }
    return 0.7;
}

function dragonPattern(x, y, maxIterations) {
    let px = x;
    let py = y;
    for (let i = 0; i < maxIterations; i++) {
        const r = Math.random();
        if (r < 0.5) {
            const newX = -0.5 * px - 0.5 * py;
            const newY = 0.5 * px - 0.5 * py;
            px = newX;
            py = newY;
        } else {
            const newX = 0.5 * px - 0.5 * py + 1;
            const newY = 0.5 * px + 0.5 * py;
            px = newX;
            py = newY;
        }
        if (Math.abs(px) > 10 || Math.abs(py) > 10) return i / maxIterations;
    }
    return 0.7;
}

function kochPattern(x, y, maxIterations) {
    let px = x;
    let py = y;
    for (let i = 0; i < maxIterations; i++) {
        const r = Math.random();
        if (r < 0.33) {
            px = px / 3;
            py = py / 3;
        } else if (r < 0.66) {
            px = (px + 2) / 3;
            py = py / 3;
        } else {
            px = (px + 1) / 3;
            py = (py + 1) / 3;
        }
        if (px < 0 || px > 1 || py < 0 || py > 1) return i / maxIterations;
    }
    return 0.7;
}

function applyFractalType(x, y, fractalType, fractalDepth, seed) {
    const maxIterations = Math.floor(3 + fractalDepth * 15);
    switch(fractalType) {
        case "Mandelbrot": return mandelbrotPattern(x, y, maxIterations);
        case "Julia": return juliaPattern(x, y, maxIterations, seed);
        case "Burning Ship": return burningShipPattern(x, y, maxIterations);
        case "Tricorn": return tricornPattern(x, y, maxIterations);
        case "Phoenix": return phoenixPattern(x, y, maxIterations, seed);
        case "Celtic": return celticPattern(x, y, maxIterations);
        case "Sierpinski": return sierpinskiPattern(x, y, maxIterations);
        case "Barnsley": return barnsleyPattern(x, y, maxIterations);
        case "Dragon": return dragonPattern(x, y, maxIterations);
        case "Koch": return kochPattern(x, y, maxIterations);
        default: return mandelbrotPattern(x, y, maxIterations);
    }
}

function applyGlitch(r, g, b, intensity, glitchType, time, x, y, w, h) {
    let newR = r, newG = g, newB = b;
    const glitchPower = Math.min(0.5, intensity * 0.8);
    
    switch(glitchType) {
        case "RGB Split":
            newR = Math.min(1, r + glitchPower * 0.15);
            newB = Math.max(0, b - glitchPower * 0.12);
            break;
        case "Chromatic":
            const shift = Math.sin(time * 0.02) * glitchPower * 0.1;
            newR = Math.min(1, r + shift);
            newB = Math.max(0, b - shift);
            break;
        case "Wave":
            const wave = Math.sin(time * 0.015 + y * 0.04) * glitchPower * 0.12;
            newR = Math.min(1, r + wave);
            newG = Math.min(1, g - wave * 0.5);
            break;
        case "Scanlines":
            const scanline = Math.sin(time * 0.02) > 0.5 ? 0.85 : 1;
            newR *= scanline;
            newG *= scanline;
            newB *= scanline;
            break;
        default:
            if (Math.random() < glitchPower * 0.08) {
                newR = Math.random() * 0.5 + 0.3;
                newG = Math.random() * 0.5 + 0.3;
                newB = Math.random() * 0.5 + 0.3;
            }
    }
    return { r: Math.min(1, Math.max(0.35, newR)), g: Math.min(1, Math.max(0.35, newG)), b: Math.min(1, Math.max(0.35, newB)) };
}

function getPattern(x, y, structure, time, complexity) {
    let value = 0.5;
    const t = time;
    
    switch(structure) {
        case "Voronoi":
            let minDist = 2;
            for (let i = 0; i < 12; i++) {
                const angle = i * 0.5236;
                const px = Math.cos(angle) * 0.8;
                const py = Math.sin(angle) * 0.8;
                const dx = x - px;
                const dy = y - py;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < minDist) minDist = dist;
            }
            value = Math.sin(minDist * 10 - t) * 0.3 + 0.5;
            break;
        case "Galaxy":
            const r = Math.sqrt(x*x + y*y);
            const angle = Math.atan2(y, x);
            const spiral = Math.sin(angle * 4 - r * 12 + t) * 0.4 + 0.5;
            const glow = Math.exp(-r * 2);
            value = spiral * 0.7 + glow * 0.3;
            break;
        case "Lightning":
            const v = Math.sin(x * 12 + t) * Math.cos(y * 12 - t);
            value = Math.pow(Math.abs(v), 0.5) * 0.5 + 0.3;
            break;
        case "Plasma":
            value = (Math.sin(x * 8 + t) + Math.cos(y * 8 + t * 1.3) + Math.sin((x + y) * 6 + t * 0.7)) / 3 + 0.3;
            break;
        default:
            value = (Math.sin(x * 8 + t) + Math.cos(y * 8 + t * 1.3) + Math.sin((x + y) * 6 + t * 0.7)) / 3 + 0.3;
    }
    value = value * (0.5 + complexity * 1.2);
    return Math.max(0.25, Math.min(0.95, value));
}

function getPalette(t, tier, seedOffset, colorMood, colorIntensity) {
    let r, g, b;
    
    if (tier === 0) {
        r = 0.7 + 0.3 * Math.sin(t * 6.28318 + seedOffset);
        g = 0.6 + 0.4 * Math.cos(t * 6.28318 + seedOffset * 1.3);
        b = 0.5 + 0.5 * Math.sin(t * 6.28318 + seedOffset * 2.1);
    } else if (tier === 1) {
        r = 0.8 + 0.2 * Math.sin(t * 12.566 + seedOffset);
        g = 0.7 + 0.3 * Math.cos(t * 12.566 + seedOffset * 0.7);
        b = 0.8 + 0.2 * Math.sin(t * 12.566 + seedOffset * 1.8);
    } else if (tier === 2) {
        r = 0.9 + 0.1 * Math.sin(t * 25.133 + seedOffset);
        g = 0.8 + 0.2 * Math.sin(t * 25.133 + seedOffset * 1.2);
        b = 0.9 + 0.1 * Math.cos(t * 25.133 + seedOffset * 0.5);
    } else {
        r = 1.0; g = 1.0; b = 1.0;
    }
    
    const intensityBoost = 0.6 + colorIntensity * 0.8;
    r = Math.min(1, r * intensityBoost);
    g = Math.min(1, g * intensityBoost);
    b = Math.min(1, b * intensityBoost);
    
    switch(colorMood) {
        case "Neon": r = Math.pow(r, 0.85); g = Math.pow(g, 0.85); b = Math.pow(b, 0.85); break;
        case "Electric": if (r > 0.5) r = 1; if (g > 0.5) g = 1; if (b > 0.5) b = 1; break;
        case "Rainbow": r = Math.sin(t * 25) * 0.5 + 0.5; g = Math.sin(t * 25 + 2.094) * 0.5 + 0.5; b = Math.sin(t * 25 + 4.188) * 0.5 + 0.5; break;
        case "Hypercolor": r = Math.abs(Math.sin(t * 30)) * 0.7 + 0.3; g = Math.abs(Math.cos(t * 28)) * 0.7 + 0.3; b = Math.abs(Math.sin(t * 32 + 1.5)) * 0.7 + 0.3; break;
    }
    
    const minBrightness = 0.35;
    r = Math.max(minBrightness, Math.min(1, r));
    g = Math.max(minBrightness, Math.min(1, g));
    b = Math.max(minBrightness, Math.min(1, b));
    return { r, g, b };
}

function assignRarityTier(seedRandom) {
    const rand = seedRandom();
    if (rand < 0.01) return 3;
    if (rand < 0.06) return 2;
    if (rand < 0.21) return 1;
    return 0;
}

let currentSeed = 0.874392;
let currentTraits = null;
let frameRequestId = null;

function drawArt(seedValue, traits, now) {
    const canvas = document.getElementById('artCanvas');
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    
    const rand = createSeededRandom(seedValue);
    const rarityTier = assignRarityTier(rand);
    farcasterMetrics.rarityTier = rarityTier;
    
    document.getElementById('seedDisplay')?.setAttribute('data-seed', seedValue.toFixed(6));
    
    const normalized = normalizeMetrics(farcasterMetrics);
    
    const rotationAngle = rand() * Math.PI * 2;
    const baseHue = rand();
    
    const fractalType = traits?.fractalType?.value || "Mandelbrot";
    const structure = traits?.structure?.value || "Plasma";
    const density = traits?.density?.value || "Dense";
    const edgeStyle = traits?.edgeStyle?.value || "Glowing";
    const motion = traits?.motion?.value || "Pulsing";
    const colorMood = traits?.colorMood?.value || "Neon";
    const glitchType = traits?.glitchType?.value || "RGB Split";
    
    const fractalDepth = normalized.dau;
    const fractalComplexity = normalized.castVolume;
    const patternDetail = normalized.reactionVelocity;
    const colorIntensity = normalized.mau;
    const glitchIntensity = normalized.userGrowth;
    
    let densityMult = 1.0;
    switch(density) {
        case "Light": densityMult = 0.85; break;
        case "Medium": densityMult = 1.1; break;
        case "Dense": densityMult = 1.4; break;
        case "Very Dense": densityMult = 1.7; break;
        default: densityMult = 1.1;
    }
    densityMult = densityMult * (0.6 + fractalDepth * 0.6);
    
    const animTime = now * 0.003;
    
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            let ux = (x / w) * 2 - 1;
            let uy = (y / h) * 2 - 1;
            
            const cosA = Math.cos(rotationAngle);
            const sinA = Math.sin(rotationAngle);
            let tx = ux * cosA - uy * sinA;
            let ty = ux * sinA + uy * cosA;
            
            const zoom = 0.65 + fractalComplexity * 0.9;
            tx *= zoom;
            ty *= zoom;
            
            let fractalValue = applyFractalType(tx, ty, fractalType, fractalDepth, baseHue);
            let pattern = getPattern(tx, ty, structure, animTime, patternDetail);
            
            const fractalBlend = 0.25 + fractalDepth * 0.4;
            pattern = pattern * (1 - fractalBlend) + fractalValue * fractalBlend;
            
            const depthEffect = fractalDepth * 0.3;
            pattern = pattern * (1 - depthEffect) + Math.pow(pattern, 1.3) * depthEffect;
            
            const warpStrength = 0.04 + fractalComplexity * 0.6;
            const warpX = Math.sin(tx * 10 + animTime * 1.2) * warpStrength;
            const warpY = Math.cos(ty * 10 + animTime * 1.0) * warpStrength;
            pattern += warpX * warpY * 0.15;
            
            pattern = pattern * densityMult;
            pattern = Math.max(0.25, Math.min(0.95, pattern));
            
            let colorT = pattern;
            let { r, g, b } = getPalette(colorT, rarityTier, baseHue, colorMood, colorIntensity);
            
            if (edgeStyle === "Glowing") {
                const glowBoost = 1.0 + fractalComplexity * 0.5;
                r = Math.min(1, r * glowBoost);
                g = Math.min(1, g * glowBoost);
                b = Math.min(1, b * glowBoost);
            } else if (edgeStyle === "Neon") {
                r = Math.pow(r, 0.9);
                g = Math.pow(g, 0.9);
                b = Math.pow(b, 0.9);
            }
            
            if (motion === "Pulsing") {
                const pulse = 0.75 + Math.sin(animTime * 2) * 0.25;
                r *= pulse; g *= pulse; b *= pulse;
            } else if (motion === "Flowing") {
                const flow = 0.75 + Math.sin(animTime * 1.2 + pattern * 18) * 0.25;
                r *= flow; g *= flow; b *= flow;
            } else if (motion === "Spinning") {
                const spin = 0.75 + Math.sin(animTime * 1.5 + pattern * 22) * 0.25;
                r *= spin; g *= spin; b *= spin;
            } else if (motion === "Warping") {
                const warpMotion = 0.7 + Math.sin(animTime * 2 + pattern * 18) * 0.3;
                r *= warpMotion; g *= warpMotion; b *= warpMotion;
            }
            
            const glitched = applyGlitch(r, g, b, glitchIntensity, glitchType, animTime, x, y, w, h);
            r = glitched.r; g = glitched.g; b = glitched.b;
            
            if (rarityTier === 3) {
                r = Math.min(1, r * 1.1);
                g = Math.min(1, g * 1.1);
                b = Math.min(1, b * 1.1);
            }
            
            r = Math.max(0.3, Math.min(1, r));
            g = Math.max(0.3, Math.min(1, g));
            b = Math.max(0.3, Math.min(1, b));
            
            const idx = (y * w + x) * 4;
            data[idx] = r * 255;
            data[idx + 1] = g * 255;
            data[idx + 2] = b * 255;
            data[idx + 3] = 255;
        }
    }
    ctx.putImageData(imgData, 0, 0);
}

function smoothAnimate(timestamp) {
    if (!currentTraits) return;
    const now = timestamp || performance.now();
    drawArt(currentSeed, currentTraits, now);
    frameRequestId = requestAnimationFrame(smoothAnimate);
}

function generateNewToken() {
    currentSeed = Math.random() * 0x7fffffff;
    const rand = createSeededRandom(currentSeed);
    currentTraits = generateRandomTraits(rand);
    displayTraits(currentTraits);
    drawArt(currentSeed, currentTraits, performance.now());
}

function exportPNG() {
    const canvas = document.getElementById('artCanvas');
    const link = document.createElement('a');
    link.download = `farcaster-art-${currentSeed.toFixed(6)}.png`;
    link.href = canvas.toDataURL();
    link.click();
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('randomSeedBtn')?.addEventListener('click', generateNewToken);
    document.getElementById('randomMetricsBtn')?.addEventListener('click', randomizeMetrics);
    document.getElementById('maxEngagementBtn')?.addEventListener('click', setMaxEngagement);
    document.getElementById('lowEngagementBtn')?.addEventListener('click', setLowEngagement);
    document.getElementById('exportBtn')?.addEventListener('click', exportPNG);
    document.getElementById('resetBtn')?.addEventListener('click', resetMetrics);
    
    const initRand = createSeededRandom(currentSeed);
    currentTraits = generateRandomTraits(initRand);
    displayTraits(currentTraits);
    updateMetricDisplay();
    updateDebugPanel("Ready! Click buttons to generate unique art.");
    drawArt(currentSeed, currentTraits, performance.now());
    frameRequestId = requestAnimationFrame(smoothAnimate);
});
