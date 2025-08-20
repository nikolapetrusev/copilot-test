class EgyptianSlotMachine {
    constructor() {
        this.canvas = document.getElementById('slotsCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.coins = 1000;
        this.betAmount = 10;
        this.isSpinning = false;
        
        // Egyptian themed symbols
        this.symbols = ['🔱', '👁️', '🐍', '🏺', '⚱️', '💎', '🪙'];
        this.symbolValues = {
            '🔱': 500, // Trident - highest
            '👁️': 300, // Eye of Horus
            '🐍': 200, // Snake
            '🏺': 150, // Vase
            '⚱️': 100, // Urn
            '💎': 80,  // Gem
            '🪙': 50   // Coin - lowest
        };
        
        // Slot reel positions
        this.reels = [
            { symbols: [], position: 0, targetPosition: 0, spinning: false },
            { symbols: [], position: 0, targetPosition: 0, spinning: false },
            { symbols: [], position: 0, targetPosition: 0, spinning: false }
        ];
        
        // Canvas dimensions
        this.reelWidth = 180;
        this.reelHeight = 350;
        this.symbolSize = 80;
        this.symbolSpacing = 100;
        
        this.init();
        this.setupEventListeners();
        this.gameLoop();
    }
    
    init() {
        // Initialize reels with random symbols
        for (let i = 0; i < 3; i++) {
            this.reels[i].symbols = [];
            for (let j = 0; j < 10; j++) {
                this.reels[i].symbols.push(this.getRandomSymbol());
            }
        }
        
        this.updateCoinDisplay();
        this.draw();
    }
    
    getRandomSymbol() {
        const weights = [1, 2, 3, 5, 8, 10, 15]; // Lower weights for higher value symbols
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        const random = Math.random() * totalWeight;
        
        let currentWeight = 0;
        for (let i = 0; i < this.symbols.length; i++) {
            currentWeight += weights[i];
            if (random <= currentWeight) {
                return this.symbols[i];
            }
        }
        
        return this.symbols[this.symbols.length - 1];
    }
    
    setupEventListeners() {
        const spinButton = document.getElementById('spinButton');
        spinButton.addEventListener('click', () => this.spin());
        
        // Theme toggle functionality
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = document.querySelector('.theme-icon');
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('night-mode');
            const isNightMode = document.body.classList.contains('night-mode');
            themeIcon.textContent = isNightMode ? '☀️' : '🌙';
            
            // Save theme preference
            localStorage.setItem('nightMode', isNightMode);
        });
        
        // Load saved theme preference
        const savedTheme = localStorage.getItem('nightMode');
        if (savedTheme === 'true') {
            document.body.classList.add('night-mode');
            themeIcon.textContent = '☀️';
        }
    }
    
    spin() {
        if (this.isSpinning || this.coins < this.betAmount) {
            return;
        }
        
        this.coins -= this.betAmount;
        this.updateCoinDisplay();
        this.isSpinning = true;
        
        const spinButton = document.getElementById('spinButton');
        spinButton.disabled = true;
        spinButton.textContent = 'SPINNING...';
        
        // Clear any previous win message
        this.hideWinMessage();
        
        // Add new symbols to the end of each reel
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 20; j++) {
                this.reels[i].symbols.push(this.getRandomSymbol());
            }
            
            // Set random target position for each reel
            this.reels[i].targetPosition = this.reels[i].position + (15 + Math.random() * 10) * this.symbolSpacing;
            this.reels[i].spinning = true;
        }
        
        // Stop reels at different times
        setTimeout(() => this.stopReel(0), 1000 + Math.random() * 500);
        setTimeout(() => this.stopReel(1), 1500 + Math.random() * 500);
        setTimeout(() => this.stopReel(2), 2000 + Math.random() * 500);
    }
    
    stopReel(reelIndex) {
        this.reels[reelIndex].spinning = false;
        
        // Align to nearest symbol
        const remainder = this.reels[reelIndex].position % this.symbolSpacing;
        if (remainder !== 0) {
            this.reels[reelIndex].position += this.symbolSpacing - remainder;
        }
        
        // Check if all reels stopped
        if (!this.reels.some(reel => reel.spinning)) {
            this.checkWin();
            this.isSpinning = false;
            
            const spinButton = document.getElementById('spinButton');
            spinButton.disabled = this.coins < this.betAmount;
            spinButton.innerHTML = `<span class="btn-text">SPIN</span><span class="btn-cost">(-10 coins)</span>`;
            
            if (this.coins < this.betAmount) {
                this.showGameOver();
            }
        }
    }
    
    checkWin() {
        const visibleSymbols = this.getVisibleSymbols();
        let totalWin = 0;
        let winningLines = [];
        
        // Check each payline
        for (let line = 0; line < 3; line++) {
            const lineSymbols = [
                visibleSymbols[0][line],
                visibleSymbols[1][line],
                visibleSymbols[2][line]
            ];
            
            const win = this.calculateLineWin(lineSymbols);
            if (win > 0) {
                totalWin += win;
                winningLines.push(line);
            }
        }
        
        if (totalWin > 0) {
            this.coins += totalWin;
            this.updateCoinDisplay();
            this.showWin(totalWin, winningLines);
        }
    }
    
    calculateLineWin(symbols) {
        // Three of a kind
        if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
            return this.symbolValues[symbols[0]];
        }
        
        // Two of a kind (20 coins)
        if (symbols[0] === symbols[1] || symbols[1] === symbols[2] || symbols[0] === symbols[2]) {
            return 20;
        }
        
        return 0;
    }
    
    getVisibleSymbols() {
        const result = [[], [], []];
        
        for (let reel = 0; reel < 3; reel++) {
            const position = this.reels[reel].position;
            const startIndex = Math.floor(position / this.symbolSpacing);
            
            for (let i = 0; i < 3; i++) {
                const symbolIndex = (startIndex + i) % this.reels[reel].symbols.length;
                result[reel][i] = this.reels[reel].symbols[symbolIndex];
            }
        }
        
        return result;
    }
    
    showWin(amount, winningLines) {
        const message = document.getElementById('winMessage');
        message.textContent = `🎉 You won ${amount} coins! 🎉`;
        message.classList.add('show');
        
        // Highlight winning paylines
        winningLines.forEach(line => {
            const payline = document.getElementById(`payline${line + 1}`);
            payline.classList.add('active');
        });
        
        // Highlight winning combinations in the paytable
        this.highlightWinningCombinations();
        
        setTimeout(() => {
            this.hideWinMessage();
        }, 3000);
    }
    
    hideWinMessage() {
        const message = document.getElementById('winMessage');
        message.classList.remove('show');
        
        // Remove payline highlights
        for (let i = 1; i <= 3; i++) {
            const payline = document.getElementById(`payline${i}`);
            payline.classList.remove('active');
        }
        
        // Remove paytable highlights
        this.clearPaytableHighlights();
    }
    
    showGameOver() {
        const message = document.getElementById('winMessage');
        message.textContent = '💀 Game Over! No more coins! 💀';
        message.classList.add('show');
        message.style.background = 'rgba(184, 11, 11, 0.2)';
        message.style.borderColor = '#FF4444';
        message.style.color = '#FF4444';
        
        setTimeout(() => {
            if (confirm('Game Over! Would you like to restart with 1000 coins?')) {
                this.coins = 1000;
                this.updateCoinDisplay();
                this.hideWinMessage();
                
                // Reset message styling
                message.style.background = 'rgba(184, 134, 11, 0.2)';
                message.style.borderColor = '#FFD700';
                message.style.color = '#FFD700';
                
                const spinButton = document.getElementById('spinButton');
                spinButton.disabled = false;
            }
        }, 2000);
    }
    
    updateCoinDisplay() {
        document.getElementById('coinCount').textContent = this.coins;
    }
    
    highlightWinningCombinations() {
        const visibleSymbols = this.getVisibleSymbols();
        const winningSymbols = new Set();
        
        // Check each payline for wins
        for (let line = 0; line < 3; line++) {
            const lineSymbols = [
                visibleSymbols[0][line],
                visibleSymbols[1][line],
                visibleSymbols[2][line]
            ];
            
            // Three of a kind
            if (lineSymbols[0] === lineSymbols[1] && lineSymbols[1] === lineSymbols[2]) {
                winningSymbols.add(lineSymbols[0]);
            }
            
            // Two of a kind
            else if (lineSymbols[0] === lineSymbols[1] || lineSymbols[1] === lineSymbols[2] || lineSymbols[0] === lineSymbols[2]) {
                winningSymbols.add('two-kind');
            }
        }
        
        // Highlight the winning combinations in the paytable
        winningSymbols.forEach(symbol => {
            const payoutItem = document.querySelector(`[data-symbol="${symbol}"]`);
            if (payoutItem) {
                payoutItem.classList.add('winning');
            }
        });
    }
    
    clearPaytableHighlights() {
        const payoutItems = document.querySelectorAll('.payout-item.winning');
        payoutItems.forEach(item => {
            item.classList.remove('winning');
        });
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw reel backgrounds
        for (let i = 0; i < 3; i++) {
            const x = i * (this.reelWidth + 20) + 30;
            
            // Reel frame
            this.ctx.fillStyle = '#333';
            this.ctx.fillRect(x - 10, 25, this.reelWidth + 20, this.reelHeight);
            
            // Reel background
            this.ctx.fillStyle = '#111';
            this.ctx.fillRect(x, 35, this.reelWidth, this.reelHeight - 20);
        }
        
        // Draw symbols
        for (let reel = 0; reel < 3; reel++) {
            this.drawReel(reel);
        }
        
        // Draw payline indicators
        this.drawPaylineIndicators();
    }
    
    drawReel(reelIndex) {
        const reel = this.reels[reelIndex];
        const x = reelIndex * (this.reelWidth + 20) + 30;
        
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.rect(x, 35, this.reelWidth, this.reelHeight - 20);
        this.ctx.clip();
        
        const startIndex = Math.floor(reel.position / this.symbolSpacing) - 1;
        const offset = -(reel.position % this.symbolSpacing);
        
        for (let i = 0; i < 6; i++) {
            const symbolIndex = (startIndex + i) % reel.symbols.length;
            if (symbolIndex < 0) continue;
            
            const symbol = reel.symbols[symbolIndex];
            const y = 50 + offset + (i * this.symbolSpacing);
            
            // Symbol background
            this.ctx.fillStyle = '#222';
            this.ctx.fillRect(x + 10, y - this.symbolSize/2, this.reelWidth - 20, this.symbolSize);
            
            // Draw symbol
            this.ctx.font = '60px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillStyle = '#FFD700';
            this.ctx.fillText(symbol, x + this.reelWidth/2, y);
            
            // Symbol border for visible symbols
            if (y > 35 && y < this.reelHeight + 15) {
                this.ctx.strokeStyle = '#FFD700';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(x + 10, y - this.symbolSize/2, this.reelWidth - 20, this.symbolSize);
            }
        }
        
        this.ctx.restore();
    }
    
    drawPaylineIndicators() {
        this.ctx.strokeStyle = '#FFD700';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        
        const lines = [
            { y: 35 + (this.reelHeight - 20) / 3 },      // Top line
            { y: 35 + (this.reelHeight - 20) / 2 },      // Middle line  
            { y: 35 + (this.reelHeight - 20) * 2/3 }     // Bottom line
        ];
        
        lines.forEach((line, index) => {
            this.ctx.beginPath();
            this.ctx.moveTo(20, line.y);
            this.ctx.lineTo(this.canvas.width - 20, line.y);
            this.ctx.stroke();
            
            // Line number
            this.ctx.fillStyle = '#FFD700';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(`${index + 1}`, 5, line.y + 4);
        });
        
        this.ctx.setLineDash([]);
    }
    
    gameLoop() {
        // Update spinning reels
        for (let i = 0; i < 3; i++) {
            if (this.reels[i].spinning) {
                this.reels[i].position += 12; // Spin speed
            }
        }
        
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    new EgyptianSlotMachine();
});
