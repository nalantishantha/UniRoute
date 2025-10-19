#!/bin/bash

# Video Call System Setup Script
# This script sets up the video calling system for UniRoute

echo "================================================"
echo "UniRoute Video Call System Setup"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "manage.py" ]; then
    echo -e "${RED}Error: This script must be run from the backend directory${NC}"
    echo "Usage: cd backend && bash ../setup_video_call.sh"
    exit 1
fi

echo -e "${YELLOW}Step 1: Installing Python dependencies...${NC}"
pip install channels==4.0.0 channels-redis==4.1.0 daphne==4.0.0 python-decouple==3.8 django-cors-headers==4.3.1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dependencies installed successfully${NC}"
else
    echo -e "${RED}✗ Failed to install dependencies${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}Step 2: Creating database migrations...${NC}"
python manage.py makemigrations mentoring
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Migrations created successfully${NC}"
else
    echo -e "${RED}✗ Failed to create migrations${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}Step 3: Applying database migrations...${NC}"
python manage.py migrate
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Migrations applied successfully${NC}"
else
    echo -e "${RED}✗ Failed to apply migrations${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}Video Call System Setup Complete!${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Start the backend server:"
echo "   ${GREEN}python manage.py runserver${NC}"
echo ""
echo "2. In another terminal, start the frontend:"
echo "   ${GREEN}cd frontend && npm run dev${NC}"
echo ""
echo "3. Test the video call:"
echo "   - Login as a mentor (university student)"
echo "   - Go to Mentoring section"
echo "   - Accept a mentoring request"
echo "   - Click 'Join Video Meeting'"
echo "   - In another browser, login as student and join"
echo ""
echo -e "${YELLOW}For production deployment, see:${NC}"
echo "   VIDEO_CALL_README.md"
echo ""
echo -e "${GREEN}Happy video calling! 🎥${NC}"
echo ""
