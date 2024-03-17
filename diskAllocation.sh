#!/bin/bash

# Variables - Use this if you want a less change invsavie script
LV_NAME="lv_name_to_expand"
MOUNT_POINT="/mnt/expand"


# Unmount the filesystem - unmoutning because its not root
umount $MOUNT_POINT

# Resize the filesystem
resize2fs /dev/$LV_NAME

# Resize the logical volume
lvextend -l +100%FREE /dev/$LV_NAME

# Resize the filesystem to fill the logical volume
resize2fs /dev/$LV_NAME

# Remount the filesystem
mount /dev/$LV_NAME $MOUNT_POINT

echo "Volume expansion completed successfully."

# Kickoff: "chmod +x diskAllocation.sh" - to make executeable
# Execute: ./diskAllocation.sh