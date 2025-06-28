#!/bin/bash

# Install dependencies
echo "Installing dependencies..."
npm install

# Install Angular CLI globally
echo "Installing Angular CLI..."
npm install -g @angular/cli

# Build the project
echo "Building the project..."
ng build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "Build completed successfully!"
    exit 0
else
    echo "Build failed!"
    exit 1
fi
