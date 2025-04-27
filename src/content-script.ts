let popupDiv: HTMLDivElement | null = null;
let selectedTextContent = '';
let debounceTimer: number | null = null;

function createPopup(x: number, y: number) {
  if (!popupDiv) {
    popupDiv = document.createElement('div');
    popupDiv.className = 'extension-popup';
    popupDiv.innerHTML = 'Save Highlight?';
    popupDiv.style.cssText = `
      position: fixed;
      background: #1f2937;
      color: white;
      padding: 8px 12px;
      border-radius: 8px;
      cursor: pointer;
      z-index: 999999;
      font-size: 14px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    `;

    popupDiv.addEventListener('click', handleAddToList);
    document.body.appendChild(popupDiv);
  }

  popupDiv.style.top = `${y +20}px`;
  popupDiv.style.left = `${x +20}px`;
}

function handleAddToList() {
  if (selectedTextContent) {
    chrome.storage.local.get(['savedList'], (result) => {
      const currentList = result.savedList || [];
      // Check if item already exists to prevent duplicates
      if (!currentList.includes(selectedTextContent)) {
        const newList = [...currentList, selectedTextContent];
        chrome.storage.local.set({ savedList: newList }, () => {
          console.log('Text added to list:', selectedTextContent);
        });
      } else {
        console.log('Text already exists in list');
      }
    });

    // Clear selection and popup
    window.getSelection()?.removeAllRanges();
    if (popupDiv) {
      popupDiv.remove();
      popupDiv = null;
    }
  }
}

function handleSelection() {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = window.setTimeout(() => {
    const selection = window.getSelection();
    const text = selection?.toString().trim() || '';

    if (text.length > 0) {
      selectedTextContent = text;
      const range = selection?.getRangeAt(0);
      const rect = range?.getBoundingClientRect();

      if (rect) {
        createPopup(rect.left + window.scrollX, rect.top + window.scrollY);
      }
    } else if (popupDiv) {
      popupDiv.remove();
      popupDiv = null;
    }
  }, 200); // 200ms debounce time
}

document.addEventListener('mouseup', handleSelection);
