# NoGit - A Lightweight Version Control System

**Not to be mistaken for Nuggets**

## Overview
NoGit is a simple version control system built with Node.js, inspired by Git. It allows you to track file changes, commit updates, and view commit history.

## Features
- Initialize a NoGit repository
- Add files to a staging area
- Commit changes with messages
- View commit history
- Show differences between commits

## Installation
Ensure you have **Node.js** installed.

### Clone the Repository
```sh
git clone <repository-url>
cd nogit
npm install
```

## Usage

### Initialize Repository
```sh
node nogit.mjs init
```
This initializes the repository by creating a `.nogit` directory.

### Add a File
```sh
node nogit.mjs add <filename>
```
Stages the specified file for commit.

### Commit Changes
```sh
node nogit.mjs commit "Commit message"
```
Commits the staged files with a message.

### View Commit Log
```sh
node nogit.mjs log
```
Displays the history of commits.

### Show Differences Between Commits
```sh
node nogit.mjs show <commitHash>
```
Displays file changes in a specific commit.

## Project Structure
```
.nogit/
  ├── object/       # Stores commit objects
  ├── HEAD          # Stores the latest commit hash
  ├── index         # Tracks staged files
nogit.mjs           # Main script file
```

## TODO → Future Enhancements
- Implement branch management
- Add support for file diffs
- Improve error handling and logging

