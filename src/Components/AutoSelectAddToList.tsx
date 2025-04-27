import { useEffect, useState } from "react";

const AutoSelectAddToList = () => {
  const [list, setList] = useState<string[]>([]);

  useEffect(() => {
    // Load saved list from chrome.storage
    chrome.storage.local.get(['savedList'], (result) => {
      if (result.savedList) {
        setList(result.savedList);
      }
    });

    // Listen for changes to the list
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.savedList) {
        setList(changes.savedList.newValue);
      }
    });
  }, []);

  const handleRemove = (indexToRemove: number) => {
    chrome.storage.local.get(['savedList'], (result) => {
      const currentList = result.savedList || [];
      const newList = currentList.filter((_i:any, index:number) => index !== indexToRemove);
      
      chrome.storage.local.set({ savedList: newList }, () => {
        console.log('Item removed from list');
      });
    });
  };

  return (
    <div className="p-3 w-full min-w-[80vw]   mx-auto ">
      <h3 className="text-lg font-semibold mb-4">
        Saved List ({list.length} items):
      </h3>
      <ul className="list-none p-0">
        {list.map((item, index) => (
          <li
            key={index}
            className="mt-2 flex justify-between items-center p-2 bg-gray-100 rounded-md shadow-sm"
          >
            <span className="break-words mr-2">{item}</span>
            <button
              onClick={() => handleRemove(index)}
              className="bg-red-500 text-white rounded-md px-3 py-1 text-sm hover:bg-red-600 transition"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AutoSelectAddToList;

