
document.getElementById("getProblem").addEventListener("click", async () => {

  document.getElementById("loading").innerText = "Generating hints...";

  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {

    chrome.tabs.sendMessage(tabs[0].id, { action: "GET_PROBLEM" }, async (response) => {

      
      const problemText = [response.title, response.description]
        .filter(Boolean)
        .join("\n\n");
      const prompt = `
          You are a strict DSA hint generator.

          RULES:
          - Give ONLY 3 hints
          - Each must start with:
          Hint 1:
          Hint 2:
          Hint 3:
          - DO NOT explain the problem
          - DO NOT restate the problem
          - DO NOT give code
          - DO NOT give full solution

          Output ONLY hints. Nothing else.
        `;
      const aiResponse = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          
          "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: "meta/llama-4-maverick-17b-128e-instruct",
         

          messages: [
            {
              role: "system",
              content: prompt
            },
            {
              role: "user",
              content: problemText
            }
          ]
        })
      });

      
      const data = await aiResponse.json();
      const text = data.choices[0].message.content;

      
      document.getElementById("loading").innerText = " Generating smart hints...";

      

      
      console.log("AI RESPONSE:", text);

      const hint1Match = text.match(/Hint 1[:\-]?\s*(.*)/i);
      const hint2Match = text.match(/Hint 2[:\-]?\s*(.*)/i);
      const hint3Match = text.match(/Hint 3[:\-]?\s*(.*)/i);

      let hint1 = hint1Match ? hint1Match[1] : null;
      let hint2 = hint2Match ? hint2Match[1] : null;
      let hint3 = hint3Match ? hint3Match[1] : null;

      
      if (!hint1 || !hint2 || !hint3) {
        const lines = text.split("\n").filter(line => line.trim() !== "");

        hint1 = hint1 || lines[0] || "Hint not found";
        hint2 = hint2 || lines[1] || "Hint not found";
        hint3 = hint3 || lines[2] || "Hint not found";
      }

      // Show buttons
      document.getElementById("hint1Btn").style.display = "block";
      document.getElementById("hint2Btn").style.display = "block";
      document.getElementById("hint3Btn").style.display = "block";

      // Assign text
      document.getElementById("hint1").innerText = hint1;
      document.getElementById("hint2").innerText = hint2;
      document.getElementById("hint3").innerText = hint3;

    });

  });
});

// Button interactions
document.getElementById("hint1Btn").onclick = () => {
  document.getElementById("hint1").style.display = "block";
};

document.getElementById("hint2Btn").onclick = () => {
  document.getElementById("hint2").style.display = "block";
};

document.getElementById("hint3Btn").onclick = () => {
  document.getElementById("hint3").style.display = "block";
};


function showHint(id) {
  const el = document.getElementById(id);
  el.classList.add("show");
}

// Button click animations
document.getElementById("hint1Btn").onclick = () => showHint("hint1");
document.getElementById("hint2Btn").onclick = () => showHint("hint2");
document.getElementById("hint3Btn").onclick = () => showHint("hint3");

//  Theme toggle
document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("light");
};
