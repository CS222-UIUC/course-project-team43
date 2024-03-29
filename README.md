# QuickShare
QuickShare is a file-sharing platform that offers an intuitive and secure way to share files with others. With QuickShare, you can:

- **Share files anonymously**: QuickShare does not require you to create an account, so you can share files without revealing your identity.
- **Share files securely with checksum verification**: QuickShare uses SHA256 checksum verification to ensure that the files you share are not tampered with during transmission.
- **Control the duration of time a file remains in the system**: QuickShare allows you to set an expiration time for each file you share, so you can ensure that your files are only available for as long as you want.
- **Share files with no overhead**: QuickShare is designed to be lightweight and efficient, so you can share files without worrying about bloated software or complicated user interfaces.
- **Upload large files that other services will not**: QuickShare has been optimized to handle large files with ease, so you can share files that might be too big for other services to handle.

## Getting Started
To use QuickShare, simply visit our website and drag and drop your files onto the upload panel. You can then customize the sharing options, including the duration of time the file remains in the system, and whether or not you would like a custom url for your file.

## Running locally
1. Clone the repository
2. In the repository root, run `docker build . -t quickshare`
3. In the `deploy` directory, run `docker-compose up -d`

You should change the `API_URL` environment variable in `deploy/docker-compose.yml` to the URL of your backend server. If you are running the backend locally, you should set this to `http://localhost:8000`. 

For development, you may run the servers individiually by:
```bash
cd frontend && npm run dev
cd backend && go run main.go
```

## Security
At QuickShare, we take security seriously. We use encryption and security measures to protect your files from unauthorized access or tampering. We also ensure that all user data is stored securely, and we do not share user information with third parties.

## Contributing
### Current Contributors:
- **David Gieser**: Added frontend and backend testing, robust file hashing system, and backend download functionality.
- **Mark Kraay**:  Designed architecture of system, developed majority of Golang backend with Gin framework, optimized server metrics such as disc utilization by adding compression, added robust logging system with Uber's Zap.
- **Amit Prasad**: Frontend & Backend lint checks, Github Actions CI/CD, Frontend API glue, Majority of Frontend work, Dockerization of both frontend & backend.
- **Jake Mayer**: 

If you'd like to contribute to QuickShare, we welcome pull requests! Check out our contributing guidelines to get started.

## License
QuickShare is licensed under the **MIT license**. Feel free to use, modify, and distribute this software as you see fit!
