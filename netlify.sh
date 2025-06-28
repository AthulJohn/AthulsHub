#!/bin/bash

# Install dependencies
echo "Installing dependencies..."
npm install --legacy-peer-deps

# Install Angular CLI and build dependencies globally
echo "Installing Angular CLI and build dependencies..."
npm install -g @angular/cli @angular-devkit/build-angular

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
