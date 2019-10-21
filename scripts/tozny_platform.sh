#!/bin/bash
COMMAND=$1

if [ -z "$TOZNY_PLATFORM_DIR" ]; then
	echo "TOZNY_PLATFORM_DIR must be set and should put to the local directory where the tozny platform repository is located."
	exit 1
fi

# The up command starts all Tozny services via Tozny Platform
if [ "$COMMAND" == "up" ]; then
	cd $TOZNY_PLATFORM_DIR
	docker-compose up -d
fi

# The down command stops all Tozny services via Tozny Platform
if [ "$COMMAND" == "down" ]; then
	cd $TOZNY_PLATFORM_DIR
	docker-compose down
fi

# The update pulls the latest docker image for Tozny Platform services
if [ "$COMMAND" == "update" ]; then
	cd $TOZNY_PLATFORM_DIR
	docker-compose pull
fi

