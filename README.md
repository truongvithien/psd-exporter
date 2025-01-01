# PSD Exporter

PSD Exporter is a Node.js application that allows users to upload multiple images and generate a PSD (Photoshop Document) file from them. The application uses Express.js for the server, Multer for handling file uploads, and the `ag-psd` library to create the PSD file.

## Features

- Upload multiple images
- Generate a PSD file with the uploaded images
- Automatically adjust the PSD canvas size based on the largest image dimensions

## Installation

1. Clone the repository:

```sh
git clone https://github.com/yourusername/psd-exporter.git
cd psd-exporter
```

2. Install the dependencies:

```sh
npm install
```

3. Usage

   3.1. Start the server:
   `    npm start
   `
   or for development with auto-reload:
   `    npm run dev
   `

   3.2. Open your browser and navigate to http://localhost:3000.

   3.3. Use the web interface to upload images and generate a PSD file.

## API Endpoints

- `GET /` - Serves the main HTML page for uploading images.

- `POST /upload` - Handles the image upload and PSD generation.

  - Request: Multipart form data with images.
  - Response: The generated PSD file for download.
