#!/bin/bash

# install
if [ "$1" = "install" ]; then
    echo "Installing..."

    cd ~

    if [ -d ~/src ]; then
        echo "Forky has already been installed."

    else
        sudo apt update
        sudo apt upgrade -y
        pip install opencv-python --break-system-packages
        wget https://github.com/HeavyFalcon678/FPV-Omnibot/raw/main/software.zip
        unzip -d src software.zip
        rm software.zip

        chmod +x forky.sh
        mv forky.sh forky
        mkdir -p ~/.local/bin
        mv forky ~/.local/bin/
        if ! grep -q 'export PATH="$HOME/.local/bin:$PATH"' "$HOME/.bashrc"; then
            echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$HOME/.bashrc"
        fi
        source ~/.bashrc
    fi

    cd src


elif [ "$1" = "run" ]; then
    echo "Running..."
    cd ~/src
    python app.py

else
    echo "Helping"
fi

cd ~






# cd ~

# if [ -d "~/src" ]; then
#     echo "already installed"

# else
#     wget https://github.com/HeavyFalcon678/FPV-Omnibot/raw/main/software.zip
#     unzip -d src software.zip
#     rm software.zip
# fi

# cd src


