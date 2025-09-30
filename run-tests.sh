#!/bin/bash

echo "🧪 Running Web App Tests..."
echo "================================"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js and npm first."
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Run Profile component tests
echo "📋 Running Profile Component Tests..."
npm test -- --testPathPattern=Profile.test.tsx --verbose
PROFILE_TEST_RESULT=$?

# Run Games component tests
echo "📋 Running Games Component Tests..."
npm test -- --testPathPattern=Games.test.tsx --verbose
GAMES_TEST_RESULT=$?

# Run all tests
echo "🚀 Running All Tests..."
npm test -- --verbose
ALL_TESTS_RESULT=$?

echo "================================"
echo "📊 Test Results Summary:"
echo "Profile Component Tests: $([ $PROFILE_TEST_RESULT -eq 0 ] && echo "✅ PASSED" || echo "❌ FAILED")"
echo "Games Component Tests: $([ $GAMES_TEST_RESULT -eq 0 ] && echo "✅ PASSED" || echo "❌ FAILED")"
echo "All Tests: $([ $ALL_TESTS_RESULT -eq 0 ] && echo "✅ PASSED" || echo "❌ FAILED")"
echo "================================"

# Exit with failure if any test failed
if [ $PROFILE_TEST_RESULT -ne 0 ] || [ $GAMES_TEST_RESULT -ne 0 ] || [ $ALL_TESTS_RESULT -ne 0 ]; then
    echo "❌ Some tests failed. Please fix the issues before proceeding."
    exit 1
else
    echo "✅ All tests passed! Safe to proceed with changes."
    exit 0
fi 