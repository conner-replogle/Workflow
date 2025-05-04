


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

Here's a revised version of the setup instructions, focusing on clarity and conciseness:

**Setup Instructions**

This project has two main components: a Workflow App and a server.

**Part 1: Workflow App (React Native)**

The Workflow App is a React Native application built using Expo. To run it, follow these steps:

1.  **Navigate to the Workflow Directory:** Open your terminal and navigate to the `/Workflow` directory.
2.  **Install Node.js:** Ensure Node.js is installed. If not, download it from [https://nodejs.org/en/download](https://nodejs.org/en/download).
3.  **Install Dependencies:** Run `npm install` to install the project's dependencies.
4.  **Start the App:** Run `npm run start`. This will open a dialog with options to launch the app:

    *   **Android Studio:** Launch in an Android emulator.
    *   **iOS Simulator (macOS only):** Launch in the iOS simulator.
    *   **Expo Go (iOS/Android Device):**
        *   Install the Expo Go app on your device.
        *   Scan the QR code displayed in the terminal.
        *   **Important:** If using Expo Go, you *must* configure the `EXPO_PUBLIC_API_URL` environment variable in the `.env` file. See the next section for details.

**Configuring `EXPO_PUBLIC_API_URL` for Expo Go**

If you are using the Expo Go app, you need to set the `EXPO_PUBLIC_API_URL` environment variable to point to your local machine's IP address and the server's port.

1.  **Edit the `.env` file:** Open the `.env` file located in the `/Workflow` directory.
2.  **Set `EXPO_PUBLIC_API_URL`:** Change the value of `EXPO_PUBLIC_API_URL` to your local IP address and port 8080. For example, if your local IP is `192.168.0.130`, the line should look like this:

    ```
    EXPO_PUBLIC_API_URL=http://192.168.0.130:8080
    ```

**Part 2: Running the Server**

The server is written in Go. To run it, follow these steps:

1.  **Install Go:** Ensure Go is installed. If not, download it from [https://go.dev/doc/install](https://go.dev/doc/install).
2.  **Install TensorFlow:** Make sure you have Python 3, then install TensorFlow using `pip install tensorflow`.
3.  **Start the Server:** In your terminal, navigate to the project's root directory and run `go run cmd/main.go`. The server should start up.