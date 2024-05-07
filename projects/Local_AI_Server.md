# Setting up your local AI server #

Run AI models on your own server. Benefits include:
* Enhanced Privacy and Data Security
* Fully offline (no internet required)
* Improved Performance and Speed
* Autonomy and Control

## Pre-requisites

1. Ollama - [https://ollama.com](https://ollama.com)
2. Docker - [https://docs.docker.com](https://docs.docker.com)
3. Open WebUI - [https://github.com/open-webui/open-webui](https://github.com/open-webui/open-webui)
4. Ngrok - [https://ngrok.com/product/platform](https://ngrok.com/product/platform)

### Ollama
1. Windows
   Recommend using Linux. Install *WSL*.
   ```
   wsl --install
   ```

3. Mac
   Download [ollama](https://ollama.com/download/mac).

4. Linux
   ```
   curl -fsSL https://ollama.com/install.sh | sh
   ```
   
### Docker
1. Windows (WSL) and Linux
   ```
   # Add Docker's official GPG key:
   sudo apt-get update
   sudo apt-get install ca-certificates curl
   sudo install -m 0755 -d /etc/apt/keyrings
   sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
   sudo chmod a+r /etc/apt/keyrings/docker.asc
   
   # Add the repository to Apt sources:
   echo \
   "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
   $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
   sudo tee /etc/apt/sources.list.d/docker.list 
   ```
2. Mac
   Download [docker](https://docs.docker.com/desktop/install/mac-install).
   
### Open WebUI
1. Windows (WSL),  Mac and Linux
   Run in ***open-webui*** in a Docker container
   ```
   docker run -d --network=host -v open-webui:/app/backend/data -e OLLAMA_BASE_URL=http://127.0.0.1:11434 --name open-webui --restart always ghcr.io/open-webui/open-webui:main
   ```

### Ngrok
1. Windows (WSL) and Linux
   ```
    curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null && echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list && sudo apt update && sudo apt install ngrok
    ```
2. Mac   
   Download [ngrok](https://ngrok.com/download).

**Kudos**
Thanks to NetworkChuck for this wonderful [YouTube](https://youtu.be/Wjrdr0NU4Sk?si=dZbwRFkGGLMBIMcZ) guide.
