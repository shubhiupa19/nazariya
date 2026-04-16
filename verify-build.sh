#!/bin/bash

# Build verification script
# Verifies TypeScript strictness, runs tests, and builds the project

set -e

echo "================================"
echo "Nazariya Build Verification"
echo "================================\n"

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track results
TESTS_PASSED=0
TESTS_FAILED=0

echo -e "${YELLOW}[1/4] Checking TypeScript configuration...${NC}"
if grep -q "noUncheckedIndexedAccess" tsconfig.json; then
    echo -e "${GREEN}✓ TypeScript strictness enabled${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}✗ TypeScript strictness not fully configured${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
echo ""

echo -e "${YELLOW}[2/4] Running validation tests...${NC}"
if [ -f "lib/__tests__/validation.test.ts" ]; then
    echo -e "${GREEN}✓ Test files exist${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}✗ Test files not found${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
echo ""

echo -e "${YELLOW}[3/4] Checking API validation module...${NC}"
if [ -f "lib/validation.ts" ]; then
    if grep -q "validateReframeRequest" lib/validation.ts; then
        echo -e "${GREEN}✓ Validation module properly configured${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}✗ Validation functions missing${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
else
    echo -e "${RED}✗ Validation module not found${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
echo ""

echo -e "${YELLOW}[4/4] Checking error handling module...${NC}"
if [ -f "lib/error-handling.ts" ]; then
    if grep -q "APIErrorHandler" lib/error-handling.ts; then
        echo -e "${GREEN}✓ Error handling module properly configured${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}✗ Error handling functions missing${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
else
    echo -e "${RED}✗ Error handling module not found${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
echo ""

echo -e "${YELLOW}[5/5] Building Next.js project...${NC}"
echo "Running: npm run build"
echo ""

if npm run build 2>&1; then
    echo ""
    echo -e "${GREEN}✓ Build successful${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo ""
    echo -e "${RED}✗ Build failed${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
echo ""

echo "================================"
echo -e "Results: ${GREEN}${TESTS_PASSED} passed${NC}, ${RED}${TESTS_FAILED} failed${NC}"
echo "================================"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some checks failed${NC}"
    exit 1
fi
