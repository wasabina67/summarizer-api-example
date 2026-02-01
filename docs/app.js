document.addEventListener("DOMContentLoaded", async () => {
  const statusDiv = document.getElementById("status");
  const typeSelect = document.getElementById("type");
  const formatSelect = document.getElementById("format");
  const lengthSelect = document.getElementById("length");
  const inputText = document.getElementById("inputText");
  const summarizeBtn = document.getElementById("summarizeBtn");
  const progressDiv = document.getElementById("progress");
  const resultDiv = document.getElementById("result");

  async function createSummarizer() {
    const summarizer = await Summarizer.create({
      type: typeSelect.value,
      format: formatSelect.value,
      length: lengthSelect.value,
      outputLanguage: "ja",
      sharedContext: "",
      monitor(m) {
        m.addEventListener("downloadprogress", (e) => {
          const percent = Math.round((e.loaded / e.total) * 100);
          progressDiv.textContent = `Downloading model: ${percent}%`;
        });
      },
    });
    return summarizer;
  }

  async function summarize() {
    const text = inputText.value.trim();

    if (!text) {
      resultDiv.textContent = "Please enter text to summarize.";
      resultDiv.classList.add("error");
      return;
    }

    summarizeBtn.disabled = true;
    resultDiv.textContent = "";
    resultDiv.classList.remove("error");
    resultDiv.classList.add("loading");
    progressDiv.textContent = "Initializing...";

    try {
      const summarizer = await createSummarizer();
      progressDiv.textContent = "Summarizing...";
      resultDiv.classList.remove("loading");

      const stream = summarizer.summarizeStreaming(text);

      for await (const chunk of stream) {
        resultDiv.textContent += chunk;
      }

      progressDiv.textContent = "";
      summarizer.destroy();
    } catch (error) {
      resultDiv.classList.remove("loading");
      resultDiv.classList.add("error");
      resultDiv.textContent = `Error: ${error.message}`;
      progressDiv.textContent = "";
    } finally {
      summarizeBtn.disabled = false;
    }
  }

  async function checkAvailability() {
    if (!("Summarizer" in self)) {
      statusDiv.textContent = "Summarizer API is not supported";
      statusDiv.classList.add("status-unavailable");
      return false;
    }

    const availability = await Summarizer.availability({
      outputLanguage: "ja",
    });

    if (availability === "available") {
      statusDiv.textContent = "API Ready";
      statusDiv.classList.add("status-available");
      return true;
    } else if (availability === "downloadable") {
      statusDiv.textContent = "Model download required";
      statusDiv.classList.add("status-downloadable");
      return true;
    } else {
      statusDiv.textContent = "API unavailable";
      statusDiv.classList.add("status-unavailable");
      return false;
    }
  }

  const isAvailable = await checkAvailability();

  if (isAvailable) {
    summarizeBtn.disabled = false;
    summarizeBtn.addEventListener("click", summarize);
    inputText.focus();
  }
});
