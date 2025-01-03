#!/bin/bash

function print_menu() {
    echo "Select data to view (comma-separated for multiple):"
    echo "1. messageQueue"
    echo "2. processedMessageIds"
    echo "3. blockedMessageIds"
    echo "4. previouslyBlockedMessageIds"
    echo "5. liveChatData"
    echo "6. messageBanId"
    echo "q. Quit"
}

function view_data() {
    local choice=$1
    case $choice in
        1) redis-cli -u $REDIS_URL LRANGE messageQueue 0 -1 ;;
        2) redis-cli -u $REDIS_URL SMEMBERS processedMessageIds ;;
        3) redis-cli -u $REDIS_URL SMEMBERS blockedMessageIds ;;
        4) redis-cli -u $REDIS_URL SMEMBERS previouslyBlockedMessageIds ;;
        5) 
            echo "Enter messageId for liveChatData:"
            read msgid
            redis-cli -u $REDIS_URL HGETALL "liveChatData:$msgid"
            ;;
        6)
            echo "Enter messageId for messageBanId:"
            read msgid
            redis-cli -u $REDIS_URL HGETALL "messageBanId:$msgid"
            ;;
        *) echo "Invalid option" ;;
    esac
}

while true; do
    print_menu
    read -p "Enter your choice(s): " input
    
    if [[ $input == "q" ]]; then
        echo "Exiting..."
        exit 0
    fi
    
    IFS=',' read -ra CHOICES <<< "$input"
    for choice in "${CHOICES[@]}"; do
        choice=$(echo $choice | tr -d '[:space:]')
        echo -e "\n--- Viewing data for option $choice ---"
        view_data $choice
        echo "----------------------------------------"
    done
done