chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.action === "GET_PROBLEM") {

    let title = "";
    let description = "";

    
    if (window.location.href.includes("leetcode")) {

      let rawTitle = document.querySelector(".text-title-large a")?.innerText || "";
      title = rawTitle.replace(/^\d+\.\s*/, "");

      description =
        document.querySelector('[data-track-load="description_content"]')?.innerText ||
        "Description not found";
    }

    
    else if (window.location.href.includes("hackerrank")) {

      
      title = "";

      description =
        document.querySelector(".challenge-body-html")?.innerText ||
        "Description not found";
    }

    sendResponse({ title, description });
  }

  
});
