// 常數
const defaultPageTitle = '動態按鈕控制板';

// 取得元素
const settingsBtn = document.querySelector('.settings-btn');
const settingsModal = document.querySelector('.settings-modal');
const settingsOverlay = document.querySelector('.settings-overlay');
const pageTitleInput = document.getElementById('page-title-input');
const titleListTextarea = document.getElementById('title-list');
const buttonListTextarea = document.getElementById('button-list');
const mainContent = document.getElementById('main-content');
const resetAllBtn = document.getElementById('reset-all');
const autoSaveTextarea = document.getElementById('autosave-textarea');


// 自動調整 textarea 高度
function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto'; // 先重置高度
    textarea.style.height = `${textarea.scrollHeight}px`; // 設置新的高度
}

// 綁定 textarea 的 input 事件來自動增長
titleListTextarea.addEventListener('input', () => autoResizeTextarea(titleListTextarea));
buttonListTextarea.addEventListener('input', () => autoResizeTextarea(buttonListTextarea));

// 顯示設定頁
settingsBtn.addEventListener('click', () => {
    settingsModal.style.display = 'block';
    settingsOverlay.style.display = 'block';
    autoResizeTextarea(titleListTextarea); // 調整高度
    autoResizeTextarea(buttonListTextarea); // 調整高度

    // 新增推送狀態
    history.pushState({ modalOpen: true }, '', '#settings');
});

// 關閉設定頁
function closeSettings() {
    settingsModal.style.display = 'none';
    settingsOverlay.style.display = 'none';

    // 返回上一個歷史狀態
    if (window.location.hash === '#settings') {
        history.back();
    }
}

settingsOverlay.addEventListener('click', closeSettings);

// 監聽 ESC 鍵盤事件來關閉設定頁
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { // 如果按下的是 ESC 鍵
        closeSettings();
    }
});

// 監聽 Android 返回按鈕
window.addEventListener('popstate', () => {
    closeSettings();
});

// 讀取 localStorage 資料
function loadSettings() {
    pageTitleInput.value = localStorage.getItem('dynamic-button-dashboard-head-title') || defaultPageTitle;
    document.title = pageTitleInput.value;

    titleListTextarea.value = localStorage.getItem('titles') || '';
    buttonListTextarea.value = localStorage.getItem('buttons') || '';
    autoSaveTextarea.value = localStorage.getItem('autosave-text') || '';

    autoResizeTextarea(autoSaveTextarea); // 調整高度
}

// 監聽 save-settings 按鈕
document.getElementById('save-settings').addEventListener('click', () => {
    saveSettings()
});

// 儲存設定到 localStorage
function saveSettings() {
    if (!pageTitleInput.value.trim()) {
        pageTitleInput.value = defaultPageTitle;
    }
    const pageTitle = pageTitleInput.value;
    const titles = titleListTextarea.value;
    const buttons = buttonListTextarea.value;

    localStorage.setItem('titles', titles);
    localStorage.setItem('buttons', buttons);
    localStorage.setItem('dynamic-button-dashboard-head-title', pageTitle);

    // 強制更新網頁標題（兼容某些情況下瀏覽器不立即更新的問題）
    setTimeout(() => {
        document.title = pageTitle;
    }, 10);

    renderSections();
    closeSettings();
}

// 建立分區和按鈕
function renderSections() {
    mainContent.innerHTML = ''; // 清除現有內容
    const titles = titleListTextarea.value.split('\n').filter(title => title.trim() !== '');
    const buttons = buttonListTextarea.value.split('\n').filter(button => button.trim() !== '');

    titles.forEach((title, sectionIndex) => {
        const sectionDiv = document.createElement('div');
        sectionDiv.classList.add('section');

        // 標題與重置按鈕
        const sectionHeader = document.createElement('div');
        sectionHeader.classList.add('section-header');
        sectionHeader.innerHTML = `<h3>${title}</h3>`;

        const resetBtn = document.createElement('button');
        resetBtn.classList.add('reset-btn');
        resetBtn.textContent = '♻️ 重置';
        resetBtn.addEventListener('click', () => {
            sectionDiv.querySelectorAll('.button').forEach((btn) => {
                btn.classList.remove('button-active');
                localStorage.removeItem(`button_${btn.dataset.section}_${btn.dataset.index}`);
            });
        });

        sectionHeader.appendChild(resetBtn);
        sectionDiv.appendChild(sectionHeader);

        buttons.forEach((buttonText, buttonIndex) => {
            const button = document.createElement('button');
            button.classList.add('button');
            button.textContent = buttonText;
            button.dataset.section = sectionIndex;
            button.dataset.index = buttonIndex;

            // 初始狀態
            const isActive = localStorage.getItem(`button_${sectionIndex}_${buttonIndex}`) === 'true';
            if (isActive) {
                button.classList.add('button-active');
            }

            // 切換狀態
            button.addEventListener('click', () => {
                button.classList.toggle('button-active');
                const activeState = button.classList.contains('button-active');
                localStorage.setItem(`button_${sectionIndex}_${buttonIndex}`, activeState);
            });

            sectionDiv.appendChild(button);
        });

        mainContent.appendChild(sectionDiv);
    });
}

// 全部分區重置
resetAllBtn.addEventListener('click', () => {
    document.querySelectorAll('.button').forEach(button => {
        button.classList.remove('button-active');
        localStorage.removeItem(`button_${button.dataset.section}_${button.dataset.index}`);
    });
});

// UTF-8 to Base64 URL Encode
function base64UrlEncode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
        return String.fromCharCode('0x' + p1);
    }))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

// Base64 URL Decode to UTF-8
function base64UrlDecode(str) {
    str = str
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const decoded = atob(str);
    return decodeURIComponent(decoded.split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

// 解析 URL 中的 settings 參數
function getSettingsFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const settings = params.get('settings');
    if (settings) {
        try {
            const decodedSettings = JSON.parse(base64UrlDecode(settings));
            return decodedSettings;
        } catch (e) {
            console.error("無法解析設定:", e);
        }
    }
    return null;
}

// 初始化時檢查 URL 參數並套用，然後刪除參數
function applySettingsFromUrl() {
    const settings = getSettingsFromUrl();
    if (settings) {
        if (settings.pageTitle) {
            pageTitleInput.value = settings.pageTitle;
            document.title = settings.pageTitle;
        }
        if (settings.titles) {
            titleListTextarea.value = settings.titles.join('\n');
        }
        if (settings.buttons) {
            buttonListTextarea.value = settings.buttons.join('\n');
        }
        renderSections();

        // 移除 URL 中的 settings 參數
        const params = new URLSearchParams(window.location.search);
        params.delete('settings');
        window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);

        alert("已套用設定，如要保留此設定請進入設定頁儲存");
    }
}

// 複製含設定的網址到剪貼簿
function copySettingsUrl() {
    const settings = {
        titles: titleListTextarea.value.split('\n').filter(title => title.trim() !== ''),
        buttons: buttonListTextarea.value.split('\n').filter(button => button.trim() !== '')
    };
    const encodedSettings = base64UrlEncode(JSON.stringify(settings));
    const settingsUrl = `${window.location.origin}${window.location.pathname}?settings=${encodedSettings}`;

    // 將 URL 複製到剪貼簿
    navigator.clipboard.writeText(settingsUrl).then(() => {
        alert("設定網址已複製到剪貼簿！");
    }).catch(err => {
        console.error("複製失敗: ", err);
    });
}

// 綁定複製按鈕的事件
document.getElementById('copy-url').addEventListener('click', () => {
    copySettingsUrl();
});

// autoSaveTextarea 變更時自動儲存到 localStorage
autoSaveTextarea.addEventListener('input', () => {
    localStorage.setItem('autosave-text', autoSaveTextarea.value);
    autoResizeTextarea(autoSaveTextarea);
});

// 頁面初始化
window.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    applySettingsFromUrl();
    renderSections();
});