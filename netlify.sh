#!/bin/bash

# Clear npm cache and remove node_modules
echo "Cleaning up..."
npm cache clean --force
rm -rf node_modules
rm -rf dist

# Install dependencies
echo "Installing dependencies..."
npm install --legacy-peer-deps

# Install Angular CLI globally
echo "Installing Angular CLI..."
npm install -g @angular/cli

# Install specific CSS processing dependencies
echo "Installing CSS processing dependencies..."
npm install --save-dev css-loader style-loader postcss-loader

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
