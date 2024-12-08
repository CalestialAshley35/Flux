document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("command-input");
  const output = document.getElementById("output");

  const displayOutput = (message) => {
    const messageElement = document.createElement("div");
    messageElement.textContent = message;
    output.appendChild(messageElement);
    output.scrollTop = output.scrollHeight;
  };

  const executeCommand = (command) => {
    const match = command.match(
      /^\$ code on (\w+) (.+):<(.+)> (.+):<(.+)> (.+):<(.+)>$/
    );

    if (!match) {
      displayOutput("Invalid command syntax");
      return;
    }

    const [, domain, file1, content1, file2, content2, file3, content3] = match;

    fetch("http://localhost:3000/code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        domain,
        files: {
          [file1]: content1,
          [file2]: content2,
          [file3]: content3,
        },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          displayOutput(`Error: ${data.error}`);
        } else {
          displayOutput(`${data.message}. Preview at ${data.url}`);
        }
      })
      .catch((error) => {
        displayOutput(`Error: ${error.message}`);
      });
  };

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const command = input.value.trim();
      input.value = "";

      displayOutput(`$ ${command}`);
      executeCommand(command);
    }
  });
});
