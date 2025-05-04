


1. "README.txt" file containing all file names and for each file a brief description about the
content of the file.
Your "README.txt" must explain exactly how to run your software:
 - exact process of how to compile your source code and build a runnable file
 - where to find the executable file if you already supplied one
 - how exactly to run the executable—what are the allowed input parameters
 - if it is necessary to authenticate the user, then list some example user IDs and
passwords that will work
 - describe the allowed values of all parameters that need to be entered while
running your program

2. PDF files containing the all previous reports, as these were originally sumbitted, not as
modified as part of Final Report.

3. Microsoft PowerPoint files containing slides you used for your project presentation.

4. PDF file containing the entire Final Report. The report should appear as a single file.

5. Complete project source code (Java files, or other programming or markup language, if
such is used)

6. Images or button icons (or any assets) loaded by the program when run

7. Shell-scripts, CGI scripts, HTML files, and any and all other files needed to run the
program

8. Database tables and files or plain files containing example data to run the program

9. Anything else that your program requires to be run?

10. Unit tests (program code to run unit tests and a README.txt on how to run the unit
tests)

11. Integration tests (program code to run unit tests and a README.txt on how to run the
integration tests)

Please store different information into different directories/folders. For example, your directory
tree may look like this ("README" file is in the root folder):
Each source code file should have header comments at the top information about the student
who authored it or assisted in writing and debugging the code, something like:

// written by:
// tested by:
// debugged by:
// etc.

The code will be compared with the diagrams in Final Report. The class, attribute and method
names should exactly match. It is not necessary that these are consistent with previous
Reports. However, it is critical that the final UML diagrams in final report and the final code are
consistent.


## Setup

There are 3 parts of this project.

Part 1 Workflow App:
Go to the /Workflow Directory
The worflow app is a react native app that utilizes Expo for the build process.
In order to launch you need one of the following
 - Android Studio
 - IOS simulator (Mac only)
 - IOS/Android Device with expo go installed (This requires modifying the server api env var)

Regardless of the method you need to install node js
https://nodejs.org/en/download

Next run 
``npm install``

Next run
``npm run start``


You will see a dialog prompting you to open in 
ios simulator or android sim, etc

Open the corresponding one you want to use. 

Or if you are using the Expo Go app scan the QR Code with that devices camera.


## If you are using EXPO Go







