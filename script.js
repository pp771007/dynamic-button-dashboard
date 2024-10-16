// 取得元素
const settingsBtn = document.querySelector('.settings-btn');
const settingsModal = document.querySelector('.settings-modal');
const settingsOverlay = document.querySelector('.settings-overlay');
const titleListTextarea = document.getElementById('title-list');
const buttonListTextarea = document.getElementById('button-list');
const mainContent = document.getElementById('main-content');
const resetAllBtn = document.getElementById('reset-all');

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
});

// 關閉設定頁
settingsOverlay.addEventListener('click', () => {
    settingsModal.style.display = 'none';
    settingsOverlay.style.display = 'none';
});

// 讀取 localStorage 資料
function loadSettings() {
    const savedTitles = localStorage.getItem('titles');
    const savedButtons = localStorage.getItem('buttons');
    if (savedTitles) {
        titleListTextarea.value = savedTitles;
    }
    if (savedButtons) {
        buttonListTextarea.value = savedButtons;
    }
}

// 儲存設定到 localStorage
document.getElementById('save-settings').addEventListener('click', () => {
    const titles = titleListTextarea.value;
    const buttons = buttonListTextarea.value;
    localStorage.setItem('titles', titles);
    localStorage.setItem('buttons', buttons);
    renderSections();
    settingsModal.style.display = 'none';
    settingsOverlay.style.display = 'none';
});

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
        resetBtn.textContent = '重置';
        resetBtn.addEventListener('click', () => {
            sectionDiv.querySelectorAll('.button').forEach((btn) => {
                btn.style.backgroundColor = '#fff';
                btn.style.color = '#000';
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

            // 初始顏色
            const savedColor = localStorage.getItem(`button_${sectionIndex}_${buttonIndex}`);
            if (savedColor) {
                button.style.backgroundColor = savedColor;
                button.style.color = savedColor === '#fff' ? '#000' : '#fff';
            }

            // 切換顏色
            button.addEventListener('click', () => {
                if (button.style.backgroundColor === 'green') {
                    button.style.backgroundColor = '#fff';
                    button.style.color = '#000';
                } else {
                    button.style.backgroundColor = 'green';
                    button.style.color = '#fff';
                }
                localStorage.setItem(`button_${sectionIndex}_${buttonIndex}`, button.style.backgroundColor);
            });

            sectionDiv.appendChild(button);
        });

        mainContent.appendChild(sectionDiv);
    });
}

// 全部分區重置
resetAllBtn.addEventListener('click', () => {
    document.querySelectorAll('.button').forEach(button => {
        button.style.backgroundColor = '#fff';
        button.style.color = '#000';
        localStorage.removeItem(`button_${button.dataset.section}_${button.dataset.index}`);
    });
});

// 初始化
loadSettings();
renderSections();
