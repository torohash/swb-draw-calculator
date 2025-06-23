FROM node:22.16.0

RUN apt update && \
    apt install -y git bash-completion tree vim curl &&\
    apt clean && \
    rm -rf /var/lib/apt/lists/*

RUN corepack enable && \
    corepack prepare pnpm@latest --activate

# biomeインストール
RUN npm install -g @biomejs/biome

# Gitのタブ補完有効化と__git_ps1コマンドの利用
RUN echo "source /usr/share/bash-completion/completions/git" >> /home/node/.bashrc && \
    echo "if [ -f /etc/bash_completion.d/git-prompt ]; then source /etc/bash_completion.d/git-prompt; fi" >> /home/node/.bashrc

# プロンプトの設定
RUN echo "PROMPT_COMMAND='PS1_CMD1=\$(__git_ps1 \" (%s)\")'; PS1='\[\e[38;5;40m\]\u@\h\[\e[0m\]:\[\e[38;5;39m\]\w\[\e[38;5;214m\]\${PS1_CMD1}\[\e[0m\]\\$ '" >> /home/node/.bashrc

# デフォルトシェルをbashに設定
RUN chsh -s /bin/bash node

RUN chown -R node:node /home/node

USER node
WORKDIR /opt/app