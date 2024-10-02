#!/bin/bash

# Set your Redis CLI command here (if needed)
REDIS_CLI="redis-cli"

# Delete all entries in a specific hash set
HASH_SET_NAME="processedMessageIds"  # Replace with your actual hash set name
echo "Deleting hash set: $HASH_SET_NAME"
$REDIS_CLI DEL "$HASH_SET_NAME"

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
