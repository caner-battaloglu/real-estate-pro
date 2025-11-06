#!/bin/bash

# Real Estate Management System - Quick Start Script

echo "=========================================="
echo "Real Estate Management System"
echo "Quick Start Script"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if MongoDB is running
echo -e "${YELLOW}Checking MongoDB...${NC}"
if ! pgrep -x "mongod" > /dev/null; then
    echo -e "${RED}MongoDB is not running!${NC}"
    echo "Please start MongoDB first:"
    echo "  - macOS: brew services start mongodb-community"
    echo "  - Linux: sudo systemctl start mongodb"
    echo "  - Or run: mongod"
    exit 1
fi
echo -e "${GREEN}✓ MongoDB is running${NC}"
echo ""

# Install server dependencies
if [ ! -d "server/node_modules" ]; then
    echo -e "${YELLOW}Installing server dependencies...${NC}"
    cd server && npm install && cd ..
    echo -e "${GREEN}✓ Server dependencies installed${NC}"
    echo ""
else
    echo -e "${GREEN}✓ Server dependencies already installed${NC}"
    echo ""
fi

# Install client dependencies
if [ ! -d "client/node_modules" ]; then
    echo -e "${YELLOW}Installing client dependencies...${NC}"
    cd client && npm install && cd ..
    echo -e "${GREEN}✓ Client dependencies installed${NC}"
    echo ""
else
    echo -e "${GREEN}✓ Client dependencies already installed${NC}"
    echo ""
fi

# Seed database
echo -e "${YELLOW}Do you want to seed the database with test data? (y/n)${NC}"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo -e "${YELLOW}Seeding database...${NC}"
    cd server && npm run seed && cd ..
    echo -e "${GREEN}✓ Database seeded${NC}"
    echo ""
fi

echo "=========================================="
echo -e "${GREEN}Setup Complete!${NC}"
echo "=========================================="
echo ""
echo "Test Accounts:"
echo "  Admin: admin@realestate.com / Admin123!"
echo "  Agent: agent1@realestate.com / Agent123!"
echo "  User:  user1@example.com / User123!"
echo ""
echo "To start the application:"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd server && npm run dev"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd client && npm run dev"
echo ""
echo "Then visit: http://localhost:3000"
echo ""
