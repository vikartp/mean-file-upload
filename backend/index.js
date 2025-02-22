const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });

let files = [];

app.get('/', (req, res) => {
    res.send('Server running for testing file upload!');
    // res.json({ message: 'Server running for testing file upload!' });
});

app.post('/upload', upload.single('file'), (req, res) => {
    files.push(req.file.originalname);
    res.json({ message: 'File uploaded successfully!', filename: req.file.originalname });
});

app.get('/files', (req, res) => {
    res.json(files);
});

app.get('/download/:filename', (req, res) => {
    const filePath = path.join(uploadDir, req.params.filename);
    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).json({ message: 'File not found' });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
