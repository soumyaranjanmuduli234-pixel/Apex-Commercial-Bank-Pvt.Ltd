/* ==========================================================================
   Apex Commercial Bank Ltd. - Advanced Enterprise Sandbox Engine
   ========================================================================== */

// 1. Storage Schema Orchestrator
if (!localStorage.getItem('bank_accounts')) localStorage.setItem('bank_accounts', JSON.stringify({}));
if (!localStorage.getItem('managers')) localStorage.setItem('managers', JSON.stringify([]));
if (!localStorage.getItem('employees')) localStorage.setItem('employees', JSON.stringify([]));
if (!localStorage.getItem('loans')) localStorage.setItem('loans', JSON.stringify([]));
if (!localStorage.getItem('cards')) localStorage.setItem('cards', JSON.stringify([]));
if (!localStorage.getItem('tx_history')) localStorage.setItem('tx_history', JSON.stringify({}));
if (!localStorage.getItem('fixed_deposits')) localStorage.setItem('fixed_deposits', JSON.stringify({}));

// Next-Gen Feature Repositories Configuration
if (!localStorage.getItem('crypto_wallets')) localStorage.setItem('crypto_wallets', JSON.stringify({}));
if (!localStorage.getItem('insurance_policies')) localStorage.setItem('insurance_policies', JSON.stringify({}));
if (!localStorage.getItem('kyc_registry')) localStorage.setItem('kyc_registry', JSON.stringify({}));

const Session = {
    setUser: (user, role, accountNo = null) => {
        localStorage.setItem('current_session', JSON.stringify({ user, role, accountNo }));
    },
    getUser: () => JSON.parse(localStorage.getItem('current_session')),
    logout: () => { localStorage.removeItem('current_session'); window.location.href = 'index.html'; }
};

function getDB(key) { return JSON.parse(localStorage.getItem(key)); }
function setDB(key, data) { localStorage.setItem(key, JSON.stringify(data)); }

// 2. Glassmorphism Notification System
function showGlassToast(message, type = 'success') {
    const oldToast = document.getElementById('glass-toast');
    if (oldToast) oldToast.remove();

    const toast = document.createElement('div');
    toast.id = 'glass-toast';
    toast.className = `glass-toast ${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">${type === 'success' ? '✓' : '⚠️'}</span>
            <p class="toast-msg">${message}</p>
        </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px) scale(0.95)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// 3. Central Transaction Engine
function updateFakeBalance(accNum, amount, type, description = "Cash Transaction") {
    let accounts = getDB('bank_accounts') || {};
    let txHistory = getDB('tx_history') || {};
    
    if (!accounts[accNum]) return { success: false, msg: "Account Not Identified!" };
    
    // KYC Gate Checklist Check
    let kycRegistry = getDB('kyc_registry') || {};
    if (kycRegistry[accNum] !== 'VERIFIED' && description !== 'Invested in Fixed Deposit' && !description.includes('FD')) {
        if (parseFloat(amount) > 10000) {
            return { success: false, msg: "KYC Pending! Unverified limits capped at ₹10,000 max." };
        }
    }
    
    amount = parseFloat(amount);
    if (isNaN(amount) || amount <= 0) return { success: false, msg: "Invalid Amount Value!" };
    if (type === 'withdraw' && accounts[accNum].balance < amount) {
        return { success: false, msg: "Insufficient Fake Balance Pool!" };
    }
    
    if (type === 'deposit') accounts[accNum].balance += amount;
    if (type === 'withdraw') accounts[accNum].balance -= amount;
    
    setDB('bank_accounts', accounts);
    
    if (!txHistory[accNum]) txHistory[accNum] = [];
    txHistory[accNum].push({
        date: new Date().toLocaleString(),
        type: type.toUpperCase(),
        amount: amount,
        desc: description,
        refBal: accounts[accNum].balance
    });
    setDB('tx_history', txHistory);
    
    return { success: true, balance: accounts[accNum].balance };
}

/* ==========================================================================
   🚨 SYSTEM LAYER HARDENING: EXPLICIT DEV-TOOLS BLOCKER (ANTI-F12)
   ========================================================================== */
document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener('keydown', event => {
    if (event.key === "F12") { event.preventDefault(); return false; }
    if (event.ctrlKey && event.shiftKey && (event.key === 'I' || event.key === 'J' || event.key === 'C')) { event.preventDefault(); return false; }
    if (event.ctrlKey && event.key === 'u') { event.preventDefault(); return false; }
});