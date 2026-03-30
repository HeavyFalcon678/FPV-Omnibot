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
        sudo apt install -y libcap-dev
        sudo apt install -y python3-libcamera
        sudo apt install -y python3-kms++
        echo Hello
        sudo apt install python3-pip -y
        echo Test
        pip install opencv-python --break-system-packages
        pip install flask --break-system-packages
        pip install picamera2 --break-system-packages
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


        sudo touch /etc/systemd/system/forky.service
        sudo tee /etc/systemd/system/forky.service > /dev/null << EOF
[Unit]
Description=Forky Startup Script
After=network.target               
[Service]
ExecStart=/usr/bin/python3 /home/pi/src/app.py
WorkingDirectory=/home/$(whoami)
User=$(whoami)
Restart=always
[Install]
WantedBy=multi-user.target
EOF
        sudo systemctl daemon-reload
        sudo systemctl enable forky.service
        sudo systemctl start forky.service

    fi

    


elif [ "$1" = "run" ]; then
    echo "Running..."
    cd ~/src
    python app.py

else
    echo "Run this program with: forky run"
fi

cd ~
