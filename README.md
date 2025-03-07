not to be mistaken for nuggets 
NoGit - A Lightweight Version Control System

Overview

NoGit is a simple version control system built with Node.js, inspired by Git. It allows you to track file changes, commit updates, and view commit history.

Features

Initialize a NoGit repository

Add files to a staging area

Commit changes with messages

View commit history

Show differences between commits

Installation

Ensure you have Node.js installed.

Clone the Repository

git clone <repository-url>
cd nogit
npm install

Usage

Initialize Repository

node nogit.mjs init

This initializes the repository by creating a .nogit directory.

Add a File

node nogit.mjs add <filename>

Stages the specified file for commit.

Commit Changes

node nogit.mjs commit "Commit message"

Commits the staged files with a message.

View Commit Log

node nogit.mjs log

Displays the history of commits.

Show Differences Between Commits

node nogit.mjs show <commitHash>

Displays file changes in a specific commit.

Project Structure

.nogit/
  ├── object/       # Stores commit objects
  ├── HEAD          # Stores the latest commit hash
  ├── index         # Tracks staged files
nogit.mjs           # Main script file
todo ->
Future Enhancements
Implement branch management
Add support for file diffs
Improve error handling and logging


