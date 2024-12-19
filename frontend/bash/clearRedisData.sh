#!/bin/bash

# messageQueue
# processedMessageIds
# blockedMessageIds
# previouslyBlockedMessageIds
# liveChatData:key
# messageBanId:key

# Set your Redis CLI command here (if needed)
REDIS_CLI="redis-cli"

# Delete all entries in a specific hash set
processedMessageIds="processedMessageIds"  
blockedMessageIds="blockedMessageIds" 
messageQueue="messageQueue"
previouslyBlockedMessageIds="previouslyBlockedMessageIds"

echo "Deleting hash set: $processedMessageIds"
$REDIS_CLI DEL "$processedMessageIds"
echo "Deleting hash set: $blockedMessageIds"
$REDIS_CLI DEL "$blockedMessageIds"
echo "Deleting Queue : $messageQueue"
$REDIS_CLI DEL "$messageQueue"
echo "Deleting hash set : $previouslyBlockedMessageIds"
$REDIS_CLI DEL "$previouslyBlockedMessageIds"

# Delete all hashes starting with the prefix "liveChatData"
echo "Deleting all hashes with prefix 'liveChatData'..."
cursor=0

while :; do
    # Scan for keys with the specified prefix
    scan_output=$($REDIS_CLI SCAN $cursor MATCH "liveChatData:*" COUNT 1000)
    
    # Read the cursor and keys separately
    cursor=$(echo "$scan_output" | head -n 1)
    keys=$(echo "$scan_output" | tail -n +2)

    # If keys were found, delete them
    if [ -n "$keys" ]; then
        for key in $keys; do
            echo "Deleting key: $key"
            $REDIS_CLI DEL "$key"
        done
    fi

    # Break the loop if the cursor is 0 (end of scan)
    if [[ "$cursor" -eq 0 ]]; then
        break
    fi
done

echo "Deletion completed."
