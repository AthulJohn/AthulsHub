#!/bin/bash

# Clear npm cache and remove node_modules
echo "Cleaning up..."
npm cache clean --force
rm -rf node_modules
rm -rf dist

# Install dependencies with specific flags for Netlify environment
echo "Installing dependencies..."
npm install --legacy-peer-deps --prefer-offline=false --no-audit

# Install Angular CLI globally
echo "Installing Angular CLI..."
npm install -g @angular/cli

# Ensure compiler is available
echo "Installing compiler dependencies..."
npm install --save-dev @angular/compiler-cli @angular-devkit/build-angular typescript@~5.2.0

# Build the project with production configuration
echo "Building the project..."
ng build --configuration production --verbose

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "Build completed successfully!"
    exit 0
else
    echo "Build failed!"
    exit 1
fi
