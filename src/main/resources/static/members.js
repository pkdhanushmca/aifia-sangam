
const API_URL = '/api/members';
const INDEX_PAGE = '/index.html';

document.getElementById('logoutBtn').addEventListener('click', async function logout() {
    if (confirm('நீங்கள் நிச்சயமாக வெளியேற விரும்புகிறீர்களா?')) {
        const response = await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include"
        });
        if (response.ok) {
            window.location.href = INDEX_PAGE;
        }
    }
});

let allMembers = [];   // full dataset from API
let filtered = [];     // after search/filter applied
let currentPage = 1;
let pageSize = 10;
let sortKey = null;
let sortDir = 1; // 1 = asc, -1 = desc

const loadingMsg = document.getElementById('loadingMsg');
const errorMsg = document.getElementById('errorMsg');
const tableWrap = document.getElementById('tableWrap');
const tableBody = document.getElementById('tableBody');
const emptyState = document.getElementById('emptyState');
const paginationWrap = document.getElementById('paginationWrap');
const pageInfo = document.getElementById('pageInfo');
const pageControls = document.getElementById('pageControls');
const totalCount = document.getElementById('totalCount');

const searchInput = document.getElementById('searchInput');
const interestFilter = document.getElementById('interestFilter');
const areaFilter = document.getElementById('areaFilter');
const clearBtn = document.getElementById('clearBtn');
const pageSizeSelect = document.getElementById('pageSizeSelect');

async function loadMembers() {
    try {
        const res = await fetch(API_URL, {
            credentials: "include"
        });
        if (res.status === 401 || res.status === 403) {
            window.location.href = INDEX_PAGE;
            return;
        }
        if (!res.ok) throw new Error('Server error: ' + res.status);
        allMembers = await res.json();
        totalCount.textContent = allMembers.length;
        loadingMsg.style.display = 'none';
        tableWrap.style.display = 'block';
        applyFilters();
    } catch (err) {
        loadingMsg.style.display = 'none';
        errorMsg.style.display = 'block';
        errorMsg.textContent = 'தகவல்களை பெற முடியவில்லை. API இயங்குகிறதா என சரிபார்க்கவும். (' + err.message + ')';
    }
}

function applyFilters() {
    const q = searchInput.value.trim().toLowerCase();
    const interest = interestFilter.value;
    const area = areaFilter.value.trim().toLowerCase();

    filtered = allMembers.filter(m => {
        const matchesSearch = !q ||
            (m.fullName || '').toLowerCase().includes(q) ||
            (m.mobile || '').toLowerCase().includes(q) ||
            (m.area || '').toLowerCase().includes(q);
        const matchesInterest = !interest || m.interest === interest;
        const matchesArea = !area || (m.area || '').toLowerCase().includes(area);
        return matchesSearch && matchesInterest && matchesArea;
    });

    if (sortKey) {
        filtered.sort((a, b) => {
            let va = a[sortKey] ?? '';
            let vb = b[sortKey] ?? '';
            if (typeof va === 'string') va = va.toLowerCase();
            if (typeof vb === 'string') vb = vb.toLowerCase();
            if (va < vb) return -1 * sortDir;
            if (va > vb) return 1 * sortDir;
            return 0;
        });
    }

    currentPage = 1;
    renderTable();
}

function interestLabel(code) {
    const map = {
        events: 'நிகழ்ச்சிகள்', finance: 'நிதி மேலாண்மை', social: 'சமூக சேவை',
        media: 'ஊடகம்', member: 'உறுப்பினர் மட்டும்'
    };
    return map[code] || (code || '-');
}

function formatDate(iso) {
    if (!iso) return '-';
    const d = new Date(iso);
    return d.toLocaleDateString('ta-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function renderTable() {
    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * pageSize;
    const pageItems = filtered.slice(start, start + pageSize);

    if (totalItems === 0) {
        tableBody.innerHTML = '';
        emptyState.style.display = 'block';
        paginationWrap.style.display = 'none';
        return;
    }
    emptyState.style.display = 'none';
    paginationWrap.style.display = 'flex';

    tableBody.innerHTML = pageItems.map(m => `
 <tr>
 <td>${escapeHtml(m.fullName || '-')}</td>
 <td>${m.age ?? '-'}</td>
 <td>${escapeHtml(m.mobile || '-')}</td>
 <td>${escapeHtml(m.area || '-')}</td>
 <td>${escapeHtml(m.occupation || '-')}</td>
 <td><span class="badge ${m.interest || ''}">${interestLabel(m.interest)}</span></td>
 <td>${formatDate(m.submittedAt)}</td>
 </tr>
 `).join('');

    pageInfo.textContent = `${start + 1}–${Math.min(start + pageSize, totalItems)} / ${totalItems}`;
    renderPageControls(totalPages);
}

function renderPageControls(totalPages) {
    let html = '';
    html += `<button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} data-page="prev">‹</button>`;

    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    startPage = Math.max(1, endPage - maxButtons + 1);

    for (let p = startPage;p <= endPage;p++) {
        html += `<button class="page-btn ${p === currentPage ? 'active' : ''}" data-page="${p}">${p}</button>`;
    }
    html += `<button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} data-page="next">›</button>`;
    pageControls.innerHTML = html;
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

pageControls.addEventListener('click', (e) => {
    const btn = e.target.closest('.page-btn');
    if (!btn || btn.disabled) return;
    const page = btn.dataset.page;
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    if (page === 'prev') currentPage = Math.max(1, currentPage - 1);
    else if (page === 'next') currentPage = Math.min(totalPages, currentPage + 1);
    else currentPage = Number(page);
    renderTable();
});

document.querySelectorAll('thead th[data-key]').forEach(th => {
    th.addEventListener('click', () => {
        const key = th.dataset.key;
        if (sortKey === key) sortDir *= -1; else { sortKey = key; sortDir = 1; }
        applyFilters();
    });
});

pageSizeSelect.addEventListener('change', () => {
    pageSize = Number(pageSizeSelect.value);
    currentPage = 1;
    renderTable();
});

searchInput.addEventListener('input', applyFilters);
interestFilter.addEventListener('change', applyFilters);
areaFilter.addEventListener('input', applyFilters);
clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    interestFilter.value = '';
    areaFilter.value = '';
    applyFilters();
});

loadMembers();


